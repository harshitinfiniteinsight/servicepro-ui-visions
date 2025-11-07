import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockInventory, mockCustomers } from "@/data/mobileMockData";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const InventoryRefund = () => {
  const navigate = useNavigate();
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");

  const filteredItems = mockInventory.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.sku.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const selectedItemData = selectedItem ? mockInventory.find(i => i.id === selectedItem) : null;
  const refundAmount = selectedItemData && quantity 
    ? (selectedItemData.unitPrice * parseFloat(quantity))
    : 0;

  const refundReasons = [
    "Defective Item",
    "Wrong Item Shipped",
    "Customer Return",
    "Damaged in Transit",
    "Overstock",
    "Other",
  ];

  const handleSubmit = () => {
    // In real app, process refund
    navigate("/inventory");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Inventory Refund" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Item Selection */}
        <div>
          <Label>Item</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {itemSearch && (
            <div className="mt-2 space-y-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-colors",
                    selectedItem === item.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent/5"
                  )}
                  onClick={() => {
                    setSelectedItem(item.id);
                    setItemSearch(item.name);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                      <p className="text-sm font-medium">${item.unitPrice.toFixed(2)} • Stock: {item.stock}</p>
                    </div>
                    {selectedItem === item.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        {selectedItem && (
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              max={selectedItemData?.stock || 0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
            {selectedItemData && (
              <p className="text-xs text-muted-foreground mt-1">
                Available: {selectedItemData.stock} units
              </p>
            )}
          </div>
        )}

        {/* Reason */}
        <div>
          <Label>Refund Reason</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {refundReasons.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Customer (Optional) */}
        <div>
          <Label>Customer (Optional)</Label>
          <Select value={customer} onValueChange={setCustomer}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {mockCustomers.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Refund Amount */}
        {selectedItem && quantity && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-medium">Refund Amount:</span>
              <span className="text-2xl font-bold text-primary">${refundAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedItem || !quantity || !reason}
        >
          Process Refund
        </Button>
      </div>
    </div>
  );
};

export default InventoryRefund;
