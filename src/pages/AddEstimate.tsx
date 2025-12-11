import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, UserPlus, FileText, Minus, Tag, X, Percent, DollarSign, Camera, ArrowLeft, RefreshCw, List, Package, CheckCircle2, Warehouse } from "lucide-react";
import { mockCustomers, mockJobs, mockEmployees, mockDiscounts, mockEstimates } from "@/data/mockData";
import { QuickAddCustomerModal } from "@/components/modals/QuickAddCustomerModal";
import { SelectInventoryModal } from "@/components/modals/SelectInventoryModal";
import { AddCustomItemModal } from "@/components/modals/AddCustomItemModal";
import { InventoryFormModal } from "@/components/modals/InventoryFormModal";
import { FollowUpAppointmentModal } from "@/components/modals/FollowUpAppointmentModal";
import { AddAppointmentModal } from "@/components/modals/AddAppointmentModal";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AddEstimate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = id ? "edit" : "create";
  const estimate = id ? mockEstimates.find(est => est.id === id) : null;
  const estimateData = estimate as any;

  const [currentStep, setCurrentStep] = useState(1);
  const [jobAddress, setJobAddress] = useState(estimateData?.jobAddress || "");

  const [formData, setFormData] = useState({
    customerId: estimateData?.customerId || "",
    employeeId: estimateData?.employeeId || "",
    jobId: estimateData?.jobId || "",
    terms: estimateData?.terms || "net 30",
    memo: estimateData?.memo || "",
  });

  const [memoAttachment, setMemoAttachment] = useState<File | null>(null);
  const [memoAttachmentPreview, setMemoAttachmentPreview] = useState<string>("");
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const [items, setItems] = useState(estimateData?.items || []);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showSelectInventoryModal, setShowSelectInventoryModal] = useState(false);
  const [showAddCustomItemModal, setShowAddCustomItemModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsConditions, setTermsConditions] = useState(estimateData?.termsConditions || "");
  const [cancellationPolicy, setCancellationPolicy] = useState(estimateData?.cancellationPolicy || "");
  const [taxRate, setTaxRate] = useState(estimateData?.taxRate || 0);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(estimateData?.discount || null);
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

  // Step 2: Item management functions
  interface SelectedItem {
    id: string;
    name: string;
    type: "F" | "V" | "U";
    rate: number;
    quantity: number;
  }
  
  // Initialize selectedItems from estimate data in edit mode
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    if (mode === "edit" && estimateData?.items) {
      return estimateData.items.map((item: any, index: number) => {
        // Extract type from description if available (e.g., "Item Name (F)")
        let itemType: "F" | "V" | "U" = "F"; // Default to Fixed
        const typeMatch = item.description?.match(/\(([FUV])\)/);
        if (typeMatch) {
          itemType = typeMatch[1] as "F" | "V" | "U";
        }
        
        // Extract name (remove type suffix if present)
        const name = item.description?.replace(/\s*\([FUV]\)\s*$/, "") || item.description || `Item ${index + 1}`;
        
        return {
          id: `item-${index}`,
          name: name,
          type: itemType,
          rate: item.rate || item.amount || 0,
          quantity: item.quantity || 1,
        };
      });
    }
    return [];
  });

  const addExistingItem = (item: any, customPrice?: number) => {
    const price = customPrice !== undefined ? customPrice : item.price;
    const typeLabel = item.type === "Variable" ? "V" : item.type === "Fixed" ? "F" : "U";
    const newItem: SelectedItem = {
      id: item.id || `item-${Date.now()}`,
      name: item.name,
      type: typeLabel as "F" | "V" | "U",
      rate: price,
      quantity: 1,
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const addCustomItem = (item: any) => {
    // Handle type conversion - support both "F"/"V"/"U" and "Fixed"/"Variable"/"Per Unit"
    let itemType: "F" | "V" | "U" = "F"; // Default to Fixed
    if (item.type === "F" || item.type === "Fixed") {
      itemType = "F";
    } else if (item.type === "V" || item.type === "Variable") {
      itemType = "V";
    } else if (item.type === "U" || item.type === "Per Unit") {
      itemType = "U";
    }

    const newItem: SelectedItem = {
      id: item.id || `custom-${Date.now()}`,
      name: item.name || item.description,
      type: itemType,
      rate: item.rate || item.price,
      quantity: item.quantity || 1,
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const removeSelectedItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateSelectedItemQuantity = (itemId: string, change: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Calculate totals for Step 2
  const step2Subtotal = selectedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const step2Total = step2Subtotal;

  // Calculate totals for Step 3 (use selectedItems from Step 2)
  const step3Subtotal = selectedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const step3TaxAmount = step3Subtotal * (taxRate / 100);
  const step3DiscountAmount = selectedDiscount 
    ? selectedDiscount.type === "%" 
      ? step3Subtotal * (selectedDiscount.value / 100)
      : selectedDiscount.value
    : 0;
  const step3Total = step3Subtotal + step3TaxAmount - step3DiscountAmount;

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
    const estimateData = {
      ...formData,
      items,
      amount: total,
      termsConditions: showTerms ? termsConditions : "",
      cancellationPolicy: showTerms ? cancellationPolicy : "",
      memoAttachment: memoAttachment,
    };
    console.log("Form submitted:", estimateData);
    toast.success(mode === "create" ? "Estimate created successfully" : "Estimate updated successfully");
    navigate("/estimates");
    // Show follow-up appointment dialog after estimate is created
    if (mode === "create") {
      setShowFollowUpDialog(true);
    }
  };

  const handleMemoAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMemoAttachment(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMemoAttachmentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setMemoAttachmentPreview("");
      }
    }
  };

  const removeMemoAttachment = () => {
    setMemoAttachment(null);
    setMemoAttachmentPreview("");
  };

  // Get recently added customers (first 5 active customers)
  const activeCustomers = mockCustomers.filter(c => c.status === "active");
  const recentlyAddedCustomers = activeCustomers.slice(0, 5);
  const otherCustomers = activeCustomers.slice(5).sort((a, b) => a.name.localeCompare(b.name));

  // Check if Step 1 is valid
  const isStep1Valid = formData.customerId !== "";

  const handleNextStep = () => {
    if (currentStep < 4 && isStep1Valid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const stepLabels = [
    "Step 1 of 4: Customer & Team",
    "Step 2 of 4: Services",
    "Step 3 of 4: Pricing",
    "Step 4 of 4: Terms & Cancellation"
  ];

  return (
    <>
      <div className="flex-1">
        {/* Custom Header for New/Edit Estimate */}
        {mode === "create" || mode === "edit" ? (
          <header className="z-30 bg-white border-b border-gray-200 shadow-sm sticky top-0">
            <div className="flex items-center justify-between px-4 md:px-3 py-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/estimates")}
                  className="touch-target hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {mode === "create" ? "New Estimate" : "Edit Estimate"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("Inventory items synced successfully");
                  }}
                  className="gap-2 rounded-md text-sm md:text-sm md:h-9 md:px-3"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Items
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/estimates")}
                  className="gap-2 rounded-md text-sm md:text-sm md:h-9 md:px-3"
                >
                  <List className="h-4 w-4" />
                  Estimate List
                </Button>
              </div>
            </div>
          </header>
        ) : (
        <AppHeader searchPlaceholder="Search..." onSearchChange={() => {}} />
        )}
        
        <main className="px-4 sm:px-6 py-4 sm:py-6 animate-fade-in">
          {(mode === "create" || mode === "edit") && (
            <>
              {/* 4-Step Progress Indicator */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative mb-4">
                  {/* Connecting Lines */}
                  <div className="absolute top-[13px] md:top-[13px] left-0 right-0 h-0.5 md:h-0.5 bg-gray-200 -z-0">
                    <div
                      className="h-0.5 md:h-0.5 bg-[#F46A1F] transition-all duration-300"
                      style={{
                        width: currentStep && currentStep > 1 ? `${Math.min(((currentStep - 1) / 3) * 100, 100)}%` : "0%"
                      }}
                    />
                  </div>
                  
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        disabled={step > currentStep}
                        className={cn(
                          "w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center font-semibold transition-all text-sm md:text-xs",
                          step < currentStep
                            ? "bg-[#F46A1F] text-white"
                            : step === currentStep
                            ? "bg-[#F46A1F] text-white ring-4 md:ring-2 ring-[#F46A1F]/20"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        )}
                      >
                        {step < currentStep ? (
                          <CheckCircle2 className="h-5 w-5 md:h-4 md:w-4 text-white" />
                        ) : (
                          step
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-xs font-medium text-gray-700">
                    {stepLabels[currentStep - 1]}
                  </p>
                </div>
              </div>
            </>
          )}

          {(mode === "create" || mode === "edit") && currentStep === 1 ? (
            /* Step 1: Customer & Team */
            <div className="max-w-2xl md:max-w-[680px] lg:max-w-2xl mx-auto space-y-6 md:space-y-8 lg:space-y-6">
              <Card className="p-6 md:p-5 lg:p-6">
                <CardContent className="space-y-6 md:space-y-5 lg:space-y-6 p-0">
                  {/* Select Customer */}
                  <div className="space-y-2">
                    <Label htmlFor="customer" className="text-sm font-semibold">
                      Select Customer *
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={formData.customerId}
                        onValueChange={(value) => {
                          if (value === "add-new") {
                            setShowAddCustomerModal(true);
                          } else {
                            setFormData({ ...formData, customerId: value });
                          }
                        }}
                      >
                        <SelectTrigger className="h-11 md:h-10 lg:h-11 border-2 border-border/50 hover:border-primary/50 transition-colors bg-background flex-1 md:flex-[0.75] lg:flex-1">
                          <SelectValue placeholder="Please Select Customer" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover backdrop-blur-xl border-2">
                          <SelectItem value="add-new" className="text-primary font-semibold">
                            <div className="flex items-center gap-2">
                              <UserPlus className="h-4 w-4" />
                              Add New Customer
                            </div>
                          </SelectItem>
                          {recentlyAddedCustomers.length > 0 && (
                            <>
                              <Separator className="my-2" />
                              {recentlyAddedCustomers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  <div className="flex items-center gap-2">
                                    {customer.name}
                                    <Badge variant="secondary" className="text-xs">
                                      Recently Added
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </>
                          )}
                          {otherCustomers.length > 0 && (
                            <>
                              <Separator className="my-2" />
                              {otherCustomers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddCustomerModal(true)}
                        className="px-4 md:px-3 lg:px-4 md:flex-[0.25] lg:flex-none md:h-10 lg:h-11"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Job Address - Conditional */}
                  {formData.customerId && (
                    <div className="space-y-2 animate-fade-in md:mt-4">
                      <Label htmlFor="jobAddress" className="text-sm font-semibold">
                        Job Address
                      </Label>
                      <Input
                        id="jobAddress"
                        value={jobAddress}
                        onChange={(e) => setJobAddress(e.target.value)}
                        placeholder="Enter job address"
                        className="h-11 md:h-10 lg:h-11 border-2 border-border/50 hover:border-primary/50 transition-colors w-full"
                      />
                    </div>
                  )}

                  {/* Select Employee */}
                  <div className="space-y-2">
                    <Label htmlFor="employee" className="text-sm font-semibold">
                      Select Employee
                    </Label>
                    <Select
                      value={formData.employeeId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, employeeId: value })
                      }
                    >
                      <SelectTrigger className="h-11 md:h-10 lg:h-11 border-2 border-border/50 hover:border-primary/50 transition-colors bg-background w-full">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover backdrop-blur-xl border-2">
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


                  {/* Next Button */}
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStep1Valid}
                    className="w-full h-12 md:h-[48px] lg:h-12 rounded-lg font-semibold"
                  >
                    Next
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (mode === "create" || mode === "edit") && currentStep === 2 ? (
            /* Step 2: Services */
            <div className="max-w-2xl md:max-w-[680px] lg:max-w-2xl mx-auto space-y-6 md:space-y-8 lg:space-y-6">
              {/* Three Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSelectInventoryModal(true)}
                  className="h-12 md:h-11 lg:h-12 rounded-lg border-2 shadow-sm hover:shadow-md transition-all gap-2"
                >
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium">Add Existing Item</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCustomItemModal(true)}
                  className="h-12 md:h-11 lg:h-12 rounded-lg border-2 shadow-sm hover:shadow-md transition-all gap-2"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Add Custom Item</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddInventoryModal(true)}
                  className="h-12 md:h-11 lg:h-12 rounded-lg border-2 shadow-sm hover:shadow-md transition-all gap-2"
                >
                  <Warehouse className="h-5 w-5" />
                  <span className="text-sm font-medium">Add to Inventory</span>
                </Button>
              </div>

              {/* Selected Items Section */}
              {selectedItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Selected Items</h3>
                  
                  {selectedItems.map((item) => {
                    const itemTotal = item.rate * item.quantity;
                    const typeColors = {
                      F: "bg-blue-100 text-blue-700 border-blue-200",
                      V: "bg-purple-100 text-purple-700 border-purple-200",
                      U: "bg-green-100 text-green-700 border-green-200",
                    };
                    
                    return (
                      <Card key={item.id} className="p-4 md:p-3 lg:p-4 shadow-md relative">
                        <CardContent className="p-0 space-y-3 md:space-y-4">
                          {/* Row 1: Item Name (Type) + Delete Icon */}
                          <div className="flex items-start justify-between w-full gap-3">
                            <div className="text-base font-semibold text-gray-900 flex-1 truncate max-w-[75%] md:max-w-none">
                              {item.name} ({item.type})
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSelectedItem(item.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600 flex-shrink-0 ml-3"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Row 2: Rate + Quantity + Total (Single Row) */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full mt-3 gap-4">
                            {/* Rate */}
                            <div className="flex-1 min-w-[120px] font-medium text-sm text-gray-700">
                              Rate: <span className="font-semibold">${item.rate.toFixed(2)}</span>
                            </div>

                            {/* Quantity */}
                            <div className="flex-1 min-w-[140px] flex items-center gap-3">
                              <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Quantity:</Label>
                              <div className="flex items-center gap-2 border-2 border-border rounded-lg">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateSelectedItemQuantity(item.id, -1)}
                                  className="h-8 w-8 rounded-none"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateSelectedItemQuantity(item.id, 1)}
                                  className="h-8 w-8 rounded-none"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex-1 min-w-[120px] text-right font-semibold text-base text-gray-900">
                              Total: ${itemTotal.toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {selectedItems.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No items selected</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Use the buttons above to add items to your estimate
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Calculation Footer */}
              {selectedItems.length > 0 && (
                <Card className="p-4 md:p-3 lg:p-4 bg-muted/30">
                  <CardContent className="p-0 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                      <span className="text-base font-semibold text-gray-900">
                        ${step2Subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-base font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${step2Total.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bottom Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-1/2 h-12 md:h-11 lg:h-12 rounded-lg border-2"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedItems.length === 0}
                  className="w-full sm:w-1/2 h-12 md:h-11 lg:h-12 rounded-lg bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white font-semibold disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (mode === "create" || mode === "edit") && currentStep === 3 ? (
            /* Step 3: Pricing */
            <div className="max-w-2xl md:max-w-[700px] lg:max-w-[850px] mx-auto space-y-7 md:space-y-9">
              {/* Terms Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm md:text-[15px] font-medium text-gray-900">Terms</Label>
                <Select
                  value={formData.terms}
                  onValueChange={(value) => setFormData({ ...formData, terms: value })}
                >
                  <SelectTrigger className="h-[52px] md:h-[56px] rounded-xl border border-[#E5E5E5] text-sm md:text-[15px]">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover backdrop-blur-xl border-2">
                    <SelectItem value="due on receipt">Due on receipt</SelectItem>
                    <SelectItem value="net 15">Net 15</SelectItem>
                    <SelectItem value="net 30">Net 30</SelectItem>
                    <SelectItem value="net 45">Net 45</SelectItem>
                    <SelectItem value="net 60">Net 60</SelectItem>
                    <SelectItem value="net 90">Net 90</SelectItem>
                    <SelectItem value="net 120">Net 120</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add Order Discount Button */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDiscountModal(true)}
                  className="w-full h-[56px] rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] hover:bg-gray-100 justify-start gap-3 text-sm md:text-[15px] font-medium"
                >
                  <Tag className="h-5 w-5 text-gray-600" />
                  Add Order Discount
                </Button>
                {selectedDiscount && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <Tag className="h-4 w-4 text-[#FF6A2A]" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedDiscount.name} ({selectedDiscount.type === "%" ? `${selectedDiscount.value}%` : `$${selectedDiscount.value}`})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDiscount(null)}
                      className="h-6 w-6 ml-auto text-gray-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <Card className="rounded-xl bg-[#FFF4EF] border border-orange-100 shadow-sm p-6 md:p-7">
                <CardContent className="p-0 space-y-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Subtotal Row */}
                  <div className="flex justify-between items-center pb-3 border-b border-orange-200">
                    <span className="text-sm md:text-[15px] font-medium text-gray-700">Subtotal:</span>
                    <span className="text-base md:text-lg font-semibold text-gray-900">
                      ${step3Subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Tax Row */}
                  <div className="flex justify-between items-center gap-4 pb-3 border-b border-orange-200">
                    <span className="text-sm md:text-[15px] font-medium text-gray-700">Tax:</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <Input
                        type="number"
                        value={taxRate}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setTaxRate(value >= 0 ? value : 0);
                        }}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-[110px] h-10 rounded-lg border border-gray-200 text-sm text-center"
                      />
                      <span className="text-base md:text-lg font-semibold text-gray-900 min-w-[80px] text-right">
                        ${step3TaxAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Discount Row (only if applied) */}
                  {selectedDiscount && (
                    <div className="flex justify-between items-center pb-3 border-b border-orange-200">
                      <span className="text-sm md:text-[15px] font-medium text-gray-700">Discount:</span>
                      <span className="text-base md:text-lg font-semibold text-red-600">
                        -${step3DiscountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Total Row */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-base md:text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl md:text-2xl font-bold text-[#FF6A2A]">
                      ${step3Total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              <div className="space-y-3">
                <Label className="text-sm md:text-[15px] font-medium text-gray-900">Notes</Label>
                <div className="relative w-full">
                  <Textarea
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    placeholder="Add any notes or special instructions…"
                    className="w-full min-h-[150px] md:min-h-[180px] rounded-xl border border-gray-200 p-4 pr-12 md:pr-14 text-sm md:text-[15px] resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/png,image/jpeg,image/jpg,.pdf";
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error("File size must be less than 10MB");
                            return;
                          }
                          setMemoAttachment(file);
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setMemoAttachmentPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      };
                      input.click();
                    }}
                    className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full hover:bg-gray-100 transition-colors z-10"
                    aria-label="Upload file or image"
                  >
                    <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                  </button>
                </div>
                
                {/* File Preview (shown after upload) */}
                {memoAttachment && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {memoAttachmentPreview ? (
                      <img
                        src={memoAttachmentPreview}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded border"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{memoAttachment.name}</p>
                      <p className="text-xs text-gray-500">{(memoAttachment.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setMemoAttachment(null);
                        setMemoAttachmentPreview("");
                      }}
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 h-[56px] rounded-xl border-2 bg-white text-gray-700 font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 h-[56px] rounded-xl bg-[#FF6A2A] hover:bg-[#FF6A2A]/90 text-white font-bold text-base"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (mode === "create" || mode === "edit") && currentStep === 4 ? (
            /* Step 4: Terms & Cancellation */
            <div className="max-w-2xl md:max-w-[800px] lg:max-w-[900px] mx-auto space-y-7 md:space-y-8">
              {/* Terms & Conditions */}
              <div className="space-y-3">
                <Label className="text-base md:text-lg font-semibold text-gray-900">
                  Terms & Conditions
                </Label>
                <Textarea
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Enter terms and conditions…"
                  className="w-full min-h-[180px] md:min-h-[220px] rounded-xl md:rounded-2xl border border-gray-300 p-4 md:p-5 text-sm md:text-base resize-none focus:border-[#F46A1F] focus:ring-2 focus:ring-[#F46A1F]/20 transition-all"
                />
              </div>

              {/* Cancellation & Return Policy */}
              <div className="space-y-3">
                <Label className="text-base md:text-lg font-semibold text-gray-900">
                  Cancellation & Return Policy
                </Label>
                <Textarea
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="Enter cancellation and return policy…"
                  className="w-full min-h-[180px] md:min-h-[220px] rounded-xl md:rounded-2xl border border-gray-300 p-4 md:p-5 text-sm md:text-base resize-none focus:border-[#F46A1F] focus:ring-2 focus:ring-[#F46A1F]/20 transition-all"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 md:pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 max-w-[45%] h-[54px] md:h-[60px] rounded-xl md:rounded-2xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // Create/Update estimate logic here
                    if (mode === "create") {
                      toast.success("Estimate created successfully!");
                    } else {
                      toast.success("Estimate updated successfully!");
                    }
                    navigate("/estimates");
                  }}
                  className="flex-1 max-w-[45%] h-[54px] md:h-[60px] rounded-xl md:rounded-2xl bg-[#FF6A2A] hover:bg-[#FF6A2A]/90 text-white font-bold text-base"
                >
                  {mode === "create" ? "Create Estimate" : "Update Estimate"}
                </Button>
              </div>
            </div>
          ) : (
            /* Steps 2-4 or Edit Mode - Show existing form */
            <>
              {/* Page Header for Edit Mode */}
              {mode === "edit" && (
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-lg mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/estimates")}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Service Pro911 - Edit Estimate</h1>
                </div>
              </div>
            </div>
          </div>
              )}

              {/* Action Buttons Bar for Edit Mode */}
              {mode === "edit" && (
          <div className="flex items-center justify-end gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/estimates")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Estimate List
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast.success("Inventory items synced successfully");
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Items
            </Button>
          </div>
              )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 max-w-6xl mx-auto">
              {/* Customer and Employee Selection */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-sm font-semibold">Select Customer *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.customerId} onValueChange={(value) => {
                      if (value === "add-new") {
                        setShowAddCustomerModal(true);
                      } else {
                        setFormData({ ...formData, customerId: value });
                      }
                    }}>
                      <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors bg-background">
                        <SelectValue placeholder="Please Select Customer" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover backdrop-blur-xl border-2">
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
                <div className="space-y-2">
                  <Label htmlFor="employee" className="text-sm font-semibold">Select Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
                    <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors bg-background">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover backdrop-blur-xl border-2">
                      {mockEmployees.filter(e => e.status === "Active").map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Terms */}
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

              {/* Line Items Section */}
              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <div>
                    <Label className="text-lg font-semibold">Items / Services</Label>
                    <p className="text-xs text-muted-foreground">Add items to this estimate</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => setShowSelectInventoryModal(true)} className="gap-2 shadow-md hover:shadow-lg transition-all">
                      <Package className="h-4 w-4" />
                      Add Existing Item
                    </Button>
                    <Button type="button" onClick={() => setShowAddCustomItemModal(true)} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Custom Item
                    </Button>
                    <Button type="button" onClick={() => setShowAddInventoryModal(true)} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add to Inventory
                    </Button>
                  </div>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-3">
                    {items.map((item: any, index: number) => (
                      <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              {item.imagePreview && (
                                <img
                                  src={item.imagePreview}
                                  alt={item.description}
                                  className="w-16 h-16 object-cover rounded-lg border border-border"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-foreground">{item.description}</p>
                                  {item.type === "custom" && (
                                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Custom</Badge>
                                  )}
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
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateItemQuantity(index, -1)}
                                  className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateItemQuantity(index, 1)}
                                  className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
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
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button type="button" onClick={() => setShowSelectInventoryModal(true)} variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Add Existing Item
                      </Button>
                      <Button type="button" onClick={() => setShowAddCustomItemModal(true)} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Item
                      </Button>
                      <Button type="button" onClick={() => setShowAddInventoryModal(true)} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Inventory
                      </Button>
                    </div>
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
                          <p className="text-xs text-muted-foreground">Apply discount to this estimate</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" onClick={() => setShowDiscountModal(true)} className="gap-2 border-2 hover:border-primary/50 shadow-sm">
                        <Plus className="h-4 w-4" />
                        ADD ORDER DISCOUNT
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
              <div className="space-y-3">
                <Label htmlFor="memo">Memo</Label>
                <div className="relative">
                  <Input
                    id="memo"
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    placeholder="Add a memo or note..."
                    className="glass-effect pr-12"
                  />
                  <label
                    htmlFor="memo-attachment"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                  >
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  </label>
                  <input
                    id="memo-attachment"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleMemoAttachmentChange}
                    className="hidden"
                  />
                </div>

                {/* Attachment Preview */}
                {memoAttachment && (
                  <Card className="border-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {memoAttachmentPreview ? (
                          <img src={memoAttachmentPreview} alt="Preview" className="h-12 w-12 object-cover rounded border" />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{memoAttachment.name}</p>
                          <p className="text-xs text-muted-foreground">{(memoAttachment.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeMemoAttachment}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
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

              {/* Fixed Footer */}
              <div className="sticky bottom-0 bg-background border-t pt-4 pb-4 flex items-center justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/estimates")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={items.length === 0 || !formData.customerId} className="min-w-[180px] h-11 shadow-lg hover:shadow-xl transition-all">
                  {mode === "create" ? "CREATE ESTIMATE" : "SAVE CHANGES"}
                </Button>
              </div>
            </div>
          </form>
            </>
          )}
        </main>
      </div>

      <QuickAddCustomerModal
        open={showAddCustomerModal}
        onOpenChange={setShowAddCustomerModal}
      />

      <SelectInventoryModal
        open={showSelectInventoryModal}
        onOpenChange={setShowSelectInventoryModal}
        onSelectInventory={(item, customPrice) => {
          if ((mode === "create" || mode === "edit") && currentStep === 2) {
            addExistingItem(item, customPrice);
          } else {
          const price = customPrice !== undefined ? customPrice : item.price;
          const typeLabel = item.type === "Variable" ? "V" : item.type === "Fixed" ? "F" : "U";
          handleAddItem({
            description: `${item.name} (${typeLabel})`,
            quantity: 1,
            rate: price,
            amount: price,
            type: "inventory",
            inventoryId: item.id,
            sku: item.sku,
          });
          }
        }}
      />

      <AddCustomItemModal
        open={showAddCustomItemModal}
        onOpenChange={setShowAddCustomItemModal}
        onAddItem={(item) => {
          if ((mode === "create" || mode === "edit") && currentStep === 2) {
            addCustomItem(item);
          } else {
            handleAddItem(item);
          }
        }}
      />

      <InventoryFormModal
        open={showAddInventoryModal}
        onOpenChange={setShowAddInventoryModal}
        mode="create"
        onInventoryAdded={(inventory) => {
          toast.success("Item added to inventory successfully!");
          setShowAddInventoryModal(false);
        }}
      />

      <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 rounded-xl overflow-hidden">
          <DialogHeader className="bg-[#F46A1F] text-white p-6 pb-4">
            <DialogDescription className="sr-only">
              Select an existing discount or create a custom one
            </DialogDescription>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold text-white">Add Discount</DialogTitle>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Add Custom Discount Section */}
            <Card className="border-orange-200">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-5 w-5 text-[#F46A1F]" />
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
                  className="w-full bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white"
                  onClick={() => {
                    const input = document.getElementById('customDiscountValue') as HTMLInputElement;
                    const value = parseFloat(input?.value || "0");
                    const select = document.querySelector('[id="customDiscountValue"]')?.closest('.grid')?.querySelector('button');
                    const type = select?.textContent?.includes('%') ? '%' : '$';
                    
                    if (value > 0) {
                      // Use Step 3 subtotal if in Step 3, otherwise use regular subtotal
                      const currentSubtotal = mode === "create" && currentStep === 3 ? step3Subtotal : subtotal;
                      
                      const newDiscount = {
                        id: `CUSTOM-${Date.now()}`,
                        name: "Custom Discount",
                        value: value,
                        type: type
                      };
                      
                      const calculatedDiscount = type === "%" 
                        ? currentSubtotal * (value / 100)
                        : value;
                      
                      if (calculatedDiscount > currentSubtotal) {
                        setDiscountError("Discount cannot be higher than the subtotal amount");
                      } else {
                        setSelectedDiscount(newDiscount);
                        setDiscountError("");
                        setShowDiscountModal(false);
                        toast.success("Custom discount applied successfully");
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
                {mockDiscounts.map((discount) => {
                  const isSelected = selectedDiscount?.id === discount.id;
                  // Use Step 3 subtotal if in Step 3, otherwise use regular subtotal
                  const currentSubtotal = mode === "create" && currentStep === 3 ? step3Subtotal : subtotal;
                  const calculatedDiscount = discount.type === "%" 
                    ? currentSubtotal * (discount.value / 100)
                    : discount.value;
                  
                  return (
                  <Card
                    key={discount.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md rounded-xl relative",
                        isSelected
                          ? "border-2 border-[#FF6A2A] bg-orange-50/50 shadow-md"
                          : "border border-gray-200 hover:border-gray-300"
                      )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                        if (calculatedDiscount > currentSubtotal) {
                        setDiscountError(`${discount.name} (${discount.type === "%" ? `${discount.value}%` : `$${discount.value}`}) exceeds the subtotal amount`);
                        setSelectedDiscount(null);
                        toast.error("Discount cannot exceed subtotal amount");
                      } else {
                        setSelectedDiscount(discount);
                        setDiscountError("");
                        setShowDiscountModal(false);
                        toast.success(`Discount "${discount.name}" applied successfully`);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="font-semibold text-sm md:text-base mb-2 text-gray-900">{discount.name}</p>
                            <div className="flex items-center gap-1.5">
                            {discount.type === "%" ? (
                                <Percent className="h-4 w-4 text-[#FF6A2A]" />
                            ) : (
                                <DollarSign className="h-4 w-4 text-[#FF6A2A]" />
                            )}
                              <span className="text-xl font-bold text-[#FF6A2A]">
                              {discount.type === "%" ? `${discount.value}%` : `$${discount.value}`}
                            </span>
                          </div>
                          {discount.isDefault && (
                              <Badge variant="outline" className="text-xs mt-2 border-gray-300">
                                Default
                              </Badge>
                            )}
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <CheckCircle2 className="h-6 w-6 text-[#FF6A2A]" />
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
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

      <FollowUpAppointmentModal
        open={showFollowUpDialog}
        onOpenChange={setShowFollowUpDialog}
        onScheduleAppointment={() => setShowAppointmentModal(true)}
      />

      <AddAppointmentModal
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        prefilledData={{
          subject: "Follow Up",
          customerId: formData.customerId,
          employeeId: formData.employeeId,
        }}
      />
    </>
  );
};

export default AddEstimate;

