import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers, mockInventory, serviceTypes } from "@/data/mobileMockData";
import { Search, ChevronRight, Plus, Minus, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const AddEstimate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [jobType, setJobType] = useState("");
  const [items, setItems] = useState<Array<{ id: string; name: string; quantity: number; price: number }>>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredInventory = mockInventory.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.sku.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const addItem = (item: typeof mockInventory[0]) => {
    if (!items.find(i => i.id === item.id)) {
      setItems([...items, { id: item.id, name: item.name, quantity: 1, price: item.unitPrice }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const steps = [
    { number: 1, title: "Customer & Job" },
    { number: 2, title: "Services" },
    { number: 3, title: "Pricing" },
    { number: 4, title: "Preview" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="New Estimate" showBack={true} />
      
      {/* Progress Indicator */}
      <div className="px-4 pt-16 pb-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                step >= s.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step > s.number ? "✓" : s.number}
              </div>
              {idx < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-2",
                  step > s.number ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of {steps.length}: {steps[step - 1].title}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4">
        {/* Step 1: Customer & Job Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Customer</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {customerSearch && (
                <div className="mt-2 space-y-2">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-colors",
                        selectedCustomer === customer.id
                          ? "bg-primary/10 border-primary"
                          : "bg-card hover:bg-accent/5"
                      )}
                      onClick={() => setSelectedCustomer(customer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                        {selectedCustomer === customer.id && (
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

            <div>
              <Label>Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Services/Items */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {itemSearch && (
              <div className="space-y-2">
                {filteredInventory.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border bg-card flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                      <p className="text-sm font-medium">${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addItem(item)}
                      disabled={!!items.find(i => i.id === item.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">Estimate Items</h3>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No items added yet</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-12 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <div className="ml-auto">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Discounts */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <textarea
                className="w-full min-h-[120px] p-3 rounded-lg border bg-background"
                placeholder="Add any notes or special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-success">
                  <span className="font-medium">Discount ({discount}%):</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3">Customer</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCustomer ? mockCustomers.find(c => c.id === selectedCustomer)?.name : "Not selected"}
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3">Job Type</h3>
              <p className="text-sm text-muted-foreground">{jobType || "Not selected"}</p>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3">Items ({items.length})</h3>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {notes && (
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{notes}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-success">
                  <span className="font-medium">Discount:</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background space-y-2">
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              className="flex-1"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!selectedCustomer || !jobType) || step === 2 && items.length === 0}
            >
              Next
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => navigate("/estimates")}>
              Send Estimate
            </Button>
          )}
        </div>
        {step < 4 && (
          <Button variant="ghost" className="w-full" onClick={() => navigate("/estimates")}>
            Save Draft
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddEstimate;
