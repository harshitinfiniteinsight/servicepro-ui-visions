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
import { AddCustomItemModal } from "./AddCustomItemModal";
import { SelectInventoryModal } from "./SelectInventoryModal";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
  context?: "invoice" | "estimate"; // Context to determine title
}

export const AddItemModal = ({ open, onOpenChange, onAddItem, context = "invoice" }: AddItemModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSelectInventoryModal, setShowSelectInventoryModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState("");

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleInventorySelected = (inventory: any, customPrice?: number) => {
    const price = customPrice !== undefined ? customPrice : inventory.price;
    const typeLabel = inventory.type === "Variable" ? "V" : inventory.type === "Fixed" ? "F" : "U";
    
    onAddItem({
      description: `${inventory.name} (${typeLabel})`,
      quantity: 1,
      rate: price,
      amount: price,
      type: "inventory",
      inventoryId: inventory.id,
      sku: inventory.sku,
    });
    setShowSelectInventoryModal(false);
    resetModal();
  };

  const resetModal = () => {
    setShowCustomItemModal(false);
    setShowSelectInventoryModal(false);
    setSelectedInventory(null);
    setCustomPrice("");
    setSearchQuery("");
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
            {context === "estimate" 
              ? "Add Item to Estimate" 
              : "Add Item to Invoice"}
          </DialogTitle>
          <DialogDescription>
            Search inventory or create custom line items
          </DialogDescription>
        </DialogHeader>

        {!selectedInventory && (
          <div className="space-y-4 py-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowCustomItemModal(true)}
                variant="outline"
                className="h-14 gap-2 touch-target"
              >
                <Plus className="h-5 w-5" />
                Add Custom Item
              </Button>
              <Button
                onClick={() => setShowSelectInventoryModal(true)}
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

      <SelectInventoryModal
        open={showSelectInventoryModal}
        onOpenChange={setShowSelectInventoryModal}
        onSelectInventory={handleInventorySelected}
      />
      <AddCustomItemModal
        open={showCustomItemModal}
        onOpenChange={(open) => {
          setShowCustomItemModal(open);
          if (!open) {
            // Don't close parent modal when custom item modal closes
          }
        }}
        onAddItem={(item) => {
          onAddItem(item);
          setShowCustomItemModal(false);
          resetModal();
        }}
      />
    </Dialog>
  );
};
