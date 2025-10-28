import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Minus } from "lucide-react";
import { mockCustomers, mockEmployees, mockDiscounts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { QuickAddCustomerModal } from "./QuickAddCustomerModal";
import { SelectInventoryModal } from "./SelectInventoryModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EstimateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LineItem {
  id: string;
  name: string;
  rate: number;
  quantity: number;
  amount: number;
  isCustom?: boolean;
}

export function EstimateFormModal({
  open,
  onOpenChange,
}: EstimateFormModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [termsEnabled, setTermsEnabled] = useState(false);
  const [termsText, setTermsText] = useState("");
  const [cancellationEnabled, setCancellationEnabled] = useState(false);
  const [cancellationText, setCancellationText] = useState("");
  const [memo, setMemo] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("due-on-receipt");
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [customDiscountValue, setCustomDiscountValue] = useState("");
  const [customDiscountType, setCustomDiscountType] = useState<"%" | "$">("%");
  const [showCustomDiscount, setShowCustomDiscount] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemRate, setCustomItemRate] = useState("");
  const { toast } = useToast();

  const TAX_RATE = 0.08; // 8% tax

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * TAX_RATE;
  
  const discountAmount = selectedDiscount
    ? mockDiscounts.find(d => d.id === selectedDiscount)
      ? mockDiscounts.find(d => d.id === selectedDiscount)!.type === "%"
        ? subtotal * (mockDiscounts.find(d => d.id === selectedDiscount)!.value / 100)
        : mockDiscounts.find(d => d.id === selectedDiscount)!.value
      : 0
    : customDiscountValue
    ? customDiscountType === "%"
      ? subtotal * (parseFloat(customDiscountValue) / 100)
      : parseFloat(customDiscountValue)
    : 0;

  const total = subtotal + tax - discountAmount;

  const handleAddInventory = (item: any, customPrice?: number) => {
    const price = customPrice !== undefined ? customPrice : item.price;
    const newItem: LineItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      rate: price,
      quantity: 1,
      amount: price,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleAddCustomItem = () => {
    if (customItemName && customItemRate) {
      const rate = parseFloat(customItemRate);
      const newItem: LineItem = {
        id: `custom-${Date.now()}`,
        name: customItemName,
        rate,
        quantity: 1,
        amount: rate,
        isCustom: true,
      };
      setLineItems([...lineItems, newItem]);
      setCustomItemName("");
      setCustomItemRate("");
    }
  };

  const handleQuantityChange = (id: string, change: number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          amount: item.rate * newQuantity,
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleDiscountSelect = (discountId: string) => {
    setSelectedDiscount(discountId);
    setShowCustomDiscount(false);
    setCustomDiscountValue("");
  };

  const handleAddCustomDiscount = () => {
    if (customDiscountValue) {
      const discountVal = customDiscountType === "%"
        ? subtotal * (parseFloat(customDiscountValue) / 100)
        : parseFloat(customDiscountValue);
      
      if (discountVal > (subtotal + tax)) {
        toast({
          title: "Invalid Discount",
          description: "Discount cannot be higher than the total chargeable amount",
          variant: "destructive",
        });
        return;
      }
      setSelectedDiscount(null);
    }
  };

  const handleCreate = () => {
    if (!customerId || !employeeId || lineItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Estimate Created",
      description: "Your estimate has been created successfully",
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Estimate</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Customer & Employee Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Customer *</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers
                      .filter((c) => c.status === "active")
                      .map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAddOpen(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Select Employee *</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees
                      .filter((e) => e.status === "Active")
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Items & Services</Label>
              
              {lineItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Inventory/Service</th>
                        <th className="text-right p-3">Rate</th>
                        <th className="text-center p-3">Quantity</th>
                        <th className="text-right p-3">Amount</th>
                        <th className="text-center p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.name}</td>
                          <td className="text-right p-3">${item.rate.toFixed(2)}</td>
                          <td className="text-center p-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="text-right p-3 font-medium">${item.amount.toFixed(2)}</td>
                          <td className="text-center p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setInventoryModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Custom Item Input */}
              <Card>
                <CardContent className="pt-6">
                  <Label className="mb-3 block">Add Custom Item</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Item name"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={customItemRate}
                      onChange={(e) => setCustomItemRate(e.target.value)}
                      className="w-32"
                      step="0.01"
                    />
                    <Button onClick={handleAddCustomItem} disabled={!customItemName || !customItemRate}>
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Terms & Conditions</Label>
                <Switch checked={termsEnabled} onCheckedChange={setTermsEnabled} />
              </div>
              {termsEnabled && (
                <Textarea
                  placeholder="Enter terms and conditions"
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  rows={3}
                />
              )}

              <div className="flex items-center justify-between">
                <Label>Cancellation & Return Policy</Label>
                <Switch checked={cancellationEnabled} onCheckedChange={setCancellationEnabled} />
              </div>
              {cancellationEnabled && (
                <Textarea
                  placeholder="Enter cancellation and return policy"
                  value={cancellationText}
                  onChange={(e) => setCancellationText(e.target.value)}
                  rows={3}
                />
              )}
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <Label>Memo</Label>
              <Textarea
                placeholder="Add a note for the estimate"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
              />
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label>Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                  <SelectItem value="net-15">Net 15</SelectItem>
                  <SelectItem value="net-30">Net 30</SelectItem>
                  <SelectItem value="net-45">Net 45</SelectItem>
                  <SelectItem value="net-60">Net 60</SelectItem>
                  <SelectItem value="net-90">Net 90</SelectItem>
                  <SelectItem value="net-120">Net 120</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Summary */}
            <Card className="bg-accent/5">
              <CardContent className="pt-6 space-y-4">
                <Label className="text-base font-semibold">Order Summary</Label>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Discount Options */}
                <div className="space-y-3 pt-4 border-t">
                  {!showCustomDiscount ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomDiscount(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Order Discount
                    </Button>
                  ) : (
                    <Card>
                      <CardContent className="pt-4 space-y-3">
                        <Label>Add Custom Discount</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Value"
                            value={customDiscountValue}
                            onChange={(e) => setCustomDiscountValue(e.target.value)}
                            className="flex-1"
                          />
                          <Select value={customDiscountType} onValueChange={(v: "%" | "$") => setCustomDiscountType(v)}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="%">%</SelectItem>
                              <SelectItem value="$">$</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleAddCustomDiscount}>Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Existing Discounts */}
                  <div className="space-y-2">
                    <Label className="text-sm">Available Discounts</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {mockDiscounts.map((discount) => (
                        <Card
                          key={discount.id}
                          className={`cursor-pointer transition-colors ${
                            selectedDiscount === discount.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleDiscountSelect(discount.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{discount.name}</span>
                              <Badge variant="outline">
                                {discount.value}
                                {discount.type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button onClick={handleCreate} className="w-full" size="lg">
              Create Estimate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <QuickAddCustomerModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      <SelectInventoryModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onSelectInventory={handleAddInventory}
      />
    </>
  );
}
