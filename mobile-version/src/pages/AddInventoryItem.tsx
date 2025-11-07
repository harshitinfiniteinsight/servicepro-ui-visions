import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, DollarSign, AlertTriangle } from "lucide-react";

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    stock: "",
    lowStockThreshold: "",
    unitPrice: "",
    supplier: "",
  });

  const categories = ["HVAC", "Plumbing", "Electrical", "Tools"];

  const handleSubmit = () => {
    // In real app, create inventory item
    navigate("/inventory");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="New Inventory Item" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Icon Section */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <Package className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label>Item Name *</Label>
            <Input
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>SKU *</Label>
            <Input
              placeholder="ITEM-SKU-001"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Initial Stock *</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div>
              <Label>Low Stock Threshold *</Label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Unit Price *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Supplier</Label>
            <Input
              placeholder="Supplier name"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.sku || !formData.category || !formData.stock || !formData.unitPrice}
        >
          Add Item
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate("/inventory")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddInventoryItem;

