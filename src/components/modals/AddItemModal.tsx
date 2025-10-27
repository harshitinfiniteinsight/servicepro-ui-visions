import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, Search } from "lucide-react";
import { mockInventory } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: any) => void;
}

export const AddItemModal = ({ open, onOpenChange, onAddItem }: AddItemModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showInventoryList, setShowInventoryList] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [customPrice, setCustomPrice] = useState("");
  
  const [customItem, setCustomItem] = useState({
    description: "",
    quantity: 1,
    rate: 0,
  });

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomItem = () => {
    if (customItem.description && customItem.rate > 0) {
      onAddItem({
        description: customItem.description,
        quantity: customItem.quantity,
        rate: customItem.rate,
        amount: customItem.quantity * customItem.rate,
        type: "custom",
      });
      resetModal();
    }
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

  const resetModal = () => {
    setShowCustomForm(false);
    setShowInventoryList(false);
    setSelectedInventory(null);
    setCustomPrice("");
    setCustomItem({ description: "", quantity: 1, rate: 0 });
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
          <DialogTitle className="text-gradient">Add Item to Invoice</DialogTitle>
          <DialogDescription>
            Add inventory items or create custom line items
          </DialogDescription>
        </DialogHeader>

        {!showCustomForm && !showInventoryList && !selectedInventory && (
          <div className="space-y-4 py-6">
            <Button
              onClick={() => setShowCustomForm(true)}
              className="w-full h-16 text-lg gap-3"
              variant="outline"
            >
              <Plus className="h-6 w-6" />
              Add Custom Item
            </Button>
            <Button
              onClick={() => setShowInventoryList(true)}
              className="w-full h-16 text-lg gap-3"
            >
              <Package className="h-6 w-6" />
              Add From Inventory
            </Button>
          </div>
        )}

        {showCustomForm && (
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Description *</Label>
              <Input
                value={customItem.description}
                onChange={(e) => setCustomItem({ ...customItem, description: e.target.value })}
                placeholder="Enter item description"
                className="glass-effect"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={customItem.quantity}
                  onChange={(e) => setCustomItem({ ...customItem, quantity: parseFloat(e.target.value) })}
                  min="1"
                  className="glass-effect"
                />
              </div>
              <div className="grid gap-2">
                <Label>Rate ($) *</Label>
                <Input
                  type="number"
                  value={customItem.rate}
                  onChange={(e) => setCustomItem({ ...customItem, rate: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="glass-effect"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCustomForm(false)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleAddCustomItem} className="flex-1" disabled={!customItem.description || customItem.rate <= 0}>
                Add Item
              </Button>
            </div>
          </div>
        )}

        {showInventoryList && !selectedInventory && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..."
                className="pl-9 glass-effect"
              />
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-semibold">V</span> = Variable · <span className="font-semibold">F</span> = Fixed · <span className="font-semibold">U</span> = Per Unit
              </p>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredInventory.map((item) => (
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
                ))}
              </div>
            </ScrollArea>

            <Button variant="outline" onClick={() => setShowInventoryList(false)} className="w-full">
              Back
            </Button>
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
    </Dialog>
  );
};
