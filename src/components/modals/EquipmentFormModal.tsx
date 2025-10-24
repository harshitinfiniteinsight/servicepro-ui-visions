import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EquipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  equipment?: any;
}

export function EquipmentFormModal({ open, onOpenChange, mode, equipment }: EquipmentFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: equipment?.name || "",
    serialNumber: equipment?.serialNumber || "",
    sku: equipment?.sku || "",
  });

  useEffect(() => {
    if (mode === "create" && open) {
      // Auto-generate product code
      const timestamp = Date.now().toString().slice(-6);
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      setFormData(prev => ({
        ...prev,
        serialNumber: `EQ-${randomPart}-${timestamp}`,
        sku: `EQUIP-${randomPart}-${timestamp}`,
      }));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === "create" ? "Equipment Added" : "Equipment Updated",
      description: `${formData.name} has been ${mode === "create" ? "added" : "updated"} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Equipment" : "Update Equipment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Inventory Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pipe Threading Machine"
              required
            />
          </div>

          <div>
            <Label htmlFor="serialNumber">Serial Number / Product Code *</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              required
              disabled={mode === "create"}
            />
          </div>

          {mode === "edit" && (
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
          )}

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
