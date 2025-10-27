import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface StockAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

export function StockAdjustmentModal({ open, onOpenChange, item }: StockAdjustmentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    adjustBy: "",
    transactionType: "Stock In",
    adjustmentReason: "Received Inventory",
    remarks: "",
  });

  const stockInReasons = [
    "Received Inventory",
    "Correction",
    "Return or Restock",
    "Mark as Damaged",
    "Mark as Demo Units"
  ];

  const stockOutReasons = [
    "Correction",
    "Theft or Loss",
    "Mark as Damaged",
    "Mark as Demo Units"
  ];

  const getReasons = () => {
    return formData.transactionType === "Stock In" ? stockInReasons : stockOutReasons;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Stock Adjusted",
      description: `Stock for ${item?.name} has been adjusted successfully.`,
    });
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg space-y-1">
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            <p className="text-sm text-muted-foreground">Current Stock: <span className="font-semibold text-foreground">{item.stockQuantity}</span></p>
          </div>

          <div>
            <Label htmlFor="adjustBy">Adjust By *</Label>
            <Input
              id="adjustBy"
              type="number"
              value={formData.adjustBy}
              onChange={(e) => setFormData({ ...formData, adjustBy: e.target.value })}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <Label>Transaction Type *</Label>
            <RadioGroup 
              value={formData.transactionType} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                transactionType: value,
                adjustmentReason: value === "Stock In" ? "Received Inventory" : "Correction"
              })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Stock In" id="stockIn" />
                <Label htmlFor="stockIn" className="font-normal cursor-pointer">Stock In</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Stock Out" id="stockOut" />
                <Label htmlFor="stockOut" className="font-normal cursor-pointer">Stock Out</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="adjustmentReason">Adjustment Reason *</Label>
            <Select value={formData.adjustmentReason} onValueChange={(value) => setFormData({ ...formData, adjustmentReason: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getReasons().map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
