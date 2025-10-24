import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InventoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  inventory?: any;
}

export function InventoryFormModal({ open, onOpenChange, mode, inventory }: InventoryFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "Fixed",
    price: "",
    itemUnit: "",
    sku: "",
    stockQuantity: "",
  });

  useEffect(() => {
    if (mode === "create" && open) {
      // Auto-generate SKU
      const timestamp = Date.now().toString().slice(-6);
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      setFormData(prev => ({
        ...prev,
        sku: `INV-${randomPart}-${timestamp}`,
      }));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === "create" ? "Inventory Added" : "Inventory Updated",
      description: `${formData.name} has been ${mode === "create" ? "added" : "updated"} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Inventory" : "Update Inventory"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Inventory Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Inventory Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Per Unit">Per Unit</SelectItem>
                <SelectItem value="Variable">Variable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          {formData.type === "Per Unit" && (
            <div>
              <Label htmlFor="itemUnit">Item Unit *</Label>
              <Input
                id="itemUnit"
                placeholder="e.g., piece, foot, hour"
                value={formData.itemUnit}
                onChange={(e) => setFormData({ ...formData, itemUnit: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              disabled={mode === "create"}
            />
          </div>

          <div>
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
