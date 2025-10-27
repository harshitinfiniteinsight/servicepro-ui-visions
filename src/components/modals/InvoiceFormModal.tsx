import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, UserPlus, Repeat, FileText, Minus, Tag, X, Percent, DollarSign } from "lucide-react";
import { mockCustomers, mockJobs, mockEmployees, mockDiscounts } from "@/data/mockData";
import { DiscountFormModal } from "./DiscountFormModal";
import { QuickAddCustomerModal } from "./QuickAddCustomerModal";
import { AddItemModal } from "./AddItemModal";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
  mode: "create" | "edit";
}

export const InvoiceFormModal = ({ open, onOpenChange, invoice, mode }: InvoiceFormModalProps) => {
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || "",
    employeeId: invoice?.employeeId || "",
    jobId: invoice?.jobId || "",
    issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || "",
    terms: invoice?.terms || "net 30",
    invoiceType: invoice?.invoiceType || "single",
    memo: invoice?.memo || "",
  });

  const [items, setItems] = useState(invoice?.items || []);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsConditions, setTermsConditions] = useState(invoice?.termsConditions || "");
  const [cancellationPolicy, setCancellationPolicy] = useState(invoice?.cancellationPolicy || "");
  const [taxRate, setTaxRate] = useState(invoice?.taxRate || 0);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(invoice?.discount || null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const handleAddItem = (newItem: any) => {
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index));
  };

  const updateItemQuantity = (index: number, change: number) => {
    const newItems = [...items];
    const newQuantity = Math.max(1, newItems[index].quantity + change);
    newItems[index].quantity = newQuantity;
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  
  const discountAmount = selectedDiscount 
    ? selectedDiscount.type === "%" 
      ? subtotal * (selectedDiscount.value / 100)
      : selectedDiscount.value
    : 0;
  
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      ...formData,
      items,
      amount: total,
      termsConditions: showTerms ? termsConditions : "",
      cancellationPolicy: showTerms ? cancellationPolicy : "",
    };
    console.log("Form submitted:", invoiceData);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto app-card">
          <DialogHeader>
            <DialogTitle className="text-gradient flex items-center gap-2">
              {mode === "create" ? "Create New Invoice" : "Edit Invoice"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" ? "Generate an invoice for a completed job." : "Update invoice details."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Invoice Type Selector */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-base font-semibold">Invoice Type</Label>
                        <p className="text-xs text-muted-foreground">Choose between single or recurring invoice</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-background/50 rounded-xl p-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, invoiceType: "single" })}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          formData.invoiceType === "single"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted"
                        }`}
                      >
                        Single
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, invoiceType: "recurring" })}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          formData.invoiceType === "recurring"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Repeat className="h-4 w-4" />
                        Recurring
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer and Employee Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Select Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.customerId} onValueChange={(value) => {
                      if (value === "add-new") {
                        setShowAddCustomerModal(true);
                      } else {
                        setFormData({ ...formData, customerId: value });
                      }
                    }}>
                      <SelectTrigger className="glass-effect">
                        <SelectValue placeholder="Please Select Customer" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover backdrop-blur-xl">
                        <SelectItem value="add-new" className="text-primary font-semibold">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Add New Customer
                          </div>
                        </SelectItem>
                        <Separator className="my-2" />
                        {mockCustomers.filter(c => c.status === "active").map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee">Select Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
                    <SelectTrigger className="glass-effect">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover backdrop-blur-xl">
                      {mockEmployees.filter(e => e.status === "Active").map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dates and Terms */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="glass-effect"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="glass-effect"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="terms">Terms *</Label>
                  <Select value={formData.terms} onValueChange={(value) => setFormData({ ...formData, terms: value })}>
                    <SelectTrigger className="glass-effect">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover backdrop-blur-xl">
                      <SelectItem value="due on receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net 15">Net 15</SelectItem>
                      <SelectItem value="net 30">Net 30</SelectItem>
                      <SelectItem value="net 45">Net 45</SelectItem>
                      <SelectItem value="net 60">Net 60</SelectItem>
                      <SelectItem value="net 90">Net 90</SelectItem>
                      <SelectItem value="net 120">Net 120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-lg font-semibold">Items / Services</Label>
                    <p className="text-xs text-muted-foreground">Add items to this invoice</p>
                  </div>
                  <Button type="button" onClick={() => setShowAddItemModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    ADD ITEM
                  </Button>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-3">
                    {items.map((item: any, index: number) => (
                      <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-foreground">{item.description}</p>
                                {item.sku && (
                                  <Badge variant="outline" className="text-xs font-mono">{item.sku}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Rate: ${item.rate.toFixed(2)}</span>
                                <span>×</span>
                                <span>Quantity: {item.quantity}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateItemQuantity(index, -1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateItemQuantity(index, 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="text-right min-w-[100px]">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="text-xl font-bold text-primary">${item.amount.toFixed(2)}</p>
                              </div>
                              
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">No items added yet</p>
                    <Button type="button" onClick={() => setShowAddItemModal(true)} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t space-y-4">
                    {/* Discount Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-primary" />
                        <div>
                          <Label className="text-base font-semibold">Order Discount</Label>
                          <p className="text-xs text-muted-foreground">Apply discount to this invoice</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" onClick={() => setShowDiscountModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Discount
                      </Button>
                    </div>

                    {selectedDiscount && (
                      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {selectedDiscount.type === "%" ? (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Percent className="h-5 w-5 text-primary" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <DollarSign className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold">{selectedDiscount.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedDiscount.type === "%" ? `${selectedDiscount.value}%` : `$${selectedDiscount.value}`} discount
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedDiscount(null);
                                setDiscountError("");
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {discountError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{discountError}</p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="flex justify-end">
                      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 min-w-[320px]">
                        <CardContent className="p-6 space-y-3">
                          <div className="text-lg font-semibold mb-4">Order Summary</div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Tax:</span>
                              <Input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                                step="0.1"
                                className="h-7 w-16 text-xs"
                                placeholder="0"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                            <span className="font-medium">${taxAmount.toFixed(2)}</span>
                          </div>
                          
                          {selectedDiscount && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                              <span>Discount:</span>
                              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <div className="flex justify-between pt-2">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>

              {/* Memo Field */}
              <div className="grid gap-2">
                <Label htmlFor="memo">Memo</Label>
                <Input
                  id="memo"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="Add a memo or note..."
                  className="glass-effect"
                />
              </div>

              {/* Terms & Cancellation Section */}
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <Label className="text-base font-semibold">Terms & Cancellation</Label>
                        <p className="text-xs text-muted-foreground">Add terms and cancellation policy</p>
                      </div>
                    </div>
                    <Switch
                      checked={showTerms}
                      onCheckedChange={setShowTerms}
                    />
                  </div>

                  {showTerms && (
                    <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in">
                      <div className="grid gap-2">
                        <Label htmlFor="terms">Terms & Conditions</Label>
                        <Textarea
                          id="terms"
                          value={termsConditions}
                          onChange={(e) => setTermsConditions(e.target.value)}
                          placeholder="Enter terms and conditions..."
                          className="min-h-[120px] glass-effect"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cancellation">Cancellation & Return Policy</Label>
                        <Textarea
                          id="cancellation"
                          value={cancellationPolicy}
                          onChange={(e) => setCancellationPolicy(e.target.value)}
                          placeholder="Enter cancellation and return policy..."
                          className="min-h-[120px] glass-effect"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={items.length === 0 || !formData.customerId}>
                {mode === "create" ? "CREATE INVOICE" : "SAVE CHANGES"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <QuickAddCustomerModal
        open={showAddCustomerModal}
        onOpenChange={setShowAddCustomerModal}
      />

      <AddItemModal
        open={showAddItemModal}
        onOpenChange={setShowAddItemModal}
        onAddItem={handleAddItem}
      />

      <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto app-card">
          <DialogHeader>
            <DialogTitle className="text-gradient">Add Discount</DialogTitle>
            <DialogDescription>
              Select an existing discount or create a custom one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Add Custom Discount Section */}
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">Add Custom Discount</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Discount Value *</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="glass-effect"
                      id="customDiscountValue"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Type *</Label>
                    <Select defaultValue="%">
                      <SelectTrigger className="glass-effect">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover backdrop-blur-xl">
                        <SelectItem value="%">Percentage (%)</SelectItem>
                        <SelectItem value="$">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  className="w-full"
                  onClick={() => {
                    const input = document.getElementById('customDiscountValue') as HTMLInputElement;
                    const value = parseFloat(input?.value || "0");
                    const select = document.querySelector('[id="customDiscountValue"]')?.closest('.grid')?.querySelector('button');
                    const type = select?.textContent?.includes('%') ? '%' : '$';
                    
                    if (value > 0) {
                      const newDiscount = {
                        id: `CUSTOM-${Date.now()}`,
                        name: "Custom Discount",
                        value: value,
                        type: type
                      };
                      
                      const calculatedDiscount = type === "%" 
                        ? subtotal * (value / 100)
                        : value;
                      
                      if (calculatedDiscount > subtotal) {
                        setDiscountError("Discount cannot be higher than the subtotal amount");
                      } else {
                        setSelectedDiscount(newDiscount);
                        setDiscountError("");
                        setShowDiscountModal(false);
                      }
                    }
                  }}
                >
                  Add Custom Discount
                </Button>
              </CardContent>
            </Card>

            {/* Existing Discounts */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Select from Existing Discounts</Label>
              <div className="grid grid-cols-2 gap-3">
                {mockDiscounts.map((discount) => (
                  <Card
                    key={discount.id}
                    className={`cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                      selectedDiscount?.id === discount.id ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}
                    onClick={() => {
                      const calculatedDiscount = discount.type === "%" 
                        ? subtotal * (discount.value / 100)
                        : discount.value;
                      
                      if (calculatedDiscount > subtotal) {
                        setDiscountError(`${discount.name} (${discount.type === "%" ? `${discount.value}%` : `$${discount.value}`}) exceeds the subtotal amount`);
                        setSelectedDiscount(null);
                      } else {
                        setSelectedDiscount(discount);
                        setDiscountError("");
                        setShowDiscountModal(false);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1">{discount.name}</p>
                          <div className="flex items-center gap-1">
                            {discount.type === "%" ? (
                              <Percent className="h-3 w-3 text-primary" />
                            ) : (
                              <DollarSign className="h-3 w-3 text-primary" />
                            )}
                            <span className="text-lg font-bold text-primary">
                              {discount.type === "%" ? `${discount.value}%` : `$${discount.value}`}
                            </span>
                          </div>
                        </div>
                        {discount.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDiscountModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
