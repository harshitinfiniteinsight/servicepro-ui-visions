import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Wrench, Tags, FileText, AlertTriangle, Edit, Trash2, UserCheck } from "lucide-react";
import { mockInventory, mockEquipment, mockDiscounts } from "@/data/mockData";
import { InventoryFormModal } from "@/components/modals/InventoryFormModal";
import { StockAdjustmentModal } from "@/components/modals/StockAdjustmentModal";
import { LowStockAlertModal } from "@/components/modals/LowStockAlertModal";
import { DiscountFormModal } from "@/components/modals/DiscountFormModal";
import { EquipmentFormModal } from "@/components/modals/EquipmentFormModal";
import { EquipmentAssignModal } from "@/components/modals/EquipmentAssignModal";
import { EquipmentNotesModal } from "@/components/modals/EquipmentNotesModal";

const Inventory = () => {
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [stockAdjustmentModal, setStockAdjustmentModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [lowStockAlertModal, setLowStockAlertModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [equipmentAssignModal, setEquipmentAssignModal] = useState<{ open: boolean; equipment: any }>({ open: false, equipment: null });
  const [equipmentNotesModal, setEquipmentNotesModal] = useState<{ open: boolean; equipment: any }>({ open: false, equipment: null });
  const [selectedTab, setSelectedTab] = useState("inventory");

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Fixed": return "F";
      case "Variable": return "V";
      case "Per Unit": return "PER UNIT";
      default: return type;
    }
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search inventory, equipment..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory & Services</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage inventory, equipment, and discounts</p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
            <TabsTrigger value="inventory" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <Package className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="agreement-inventory" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <FileText className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Agreement</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <Tags className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Discounts</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <Wrench className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Equipment</span>
            </TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button className="gap-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Current Report</span>
              </Button>
              <Button variant="outline" className="gap-2 w-full sm:w-auto shadow-sm hover:shadow-md hover:bg-muted transition-all">
                <span className="text-sm">Generate Report</span>
              </Button>
              <Button 
                onClick={() => setInventoryModalOpen(true)} 
                className="gap-2 w-full sm:w-auto sm:ml-auto shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Inventory</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {mockInventory.map((item) => (
                <Card 
                  key={item.id} 
                  className="border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-bold text-base sm:text-lg text-foreground">
                              {item.name}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className="w-fit bg-primary/5 text-primary border-primary/30 font-semibold px-3 py-1"
                            >
                              {getTypeLabel(item.type)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 sm:gap-4">
                            <div className="px-3 py-1.5 bg-muted rounded-md">
                              <span className="text-xs font-medium text-muted-foreground">ID: </span>
                              <span className="text-xs font-bold text-foreground">{item.id}</span>
                            </div>
                            <div className="px-3 py-1.5 bg-muted rounded-md">
                              <span className="text-xs font-medium text-muted-foreground">SKU: </span>
                              <span className="text-xs font-bold text-foreground">{item.sku}</span>
                            </div>
                            <div className="px-3 py-1.5 bg-muted rounded-md">
                              <span className="text-xs font-medium text-muted-foreground">Category: </span>
                              <span className="text-xs font-bold text-foreground">{item.category}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                              <Package className="h-4 w-4 text-accent" />
                              <div>
                                <span className="text-xs text-muted-foreground block">Stock</span>
                                <span className="font-bold text-lg text-foreground">{item.stockQuantity}</span>
                              </div>
                            </div>
                            
                            {item.stockQuantity <= item.lowStockAlert && item.stockQuantity > 0 && (
                              <Badge variant="outline" className="bg-warning/15 text-warning border-warning/40 gap-1.5 px-3 py-1.5 font-semibold shadow-sm">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Low Stock Alert
                              </Badge>
                            )}
                            
                            <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                              <span className="text-xs text-muted-foreground block">Price</span>
                              <span className="font-bold text-xl text-primary">${item.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all font-medium"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="text-xs">Update</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-accent/10 hover:text-accent hover:border-accent transition-all font-medium"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          <Package className="h-3.5 w-3.5" />
                          <span className="text-xs">Stock</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-warning/10 hover:text-warning hover:border-warning transition-all font-medium"
                          onClick={() => setLowStockAlertModal({ open: true, item })}
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span className="text-xs">Alert</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all font-medium"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          <span className="text-xs">Damage</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-info/10 hover:text-info hover:border-info transition-all font-medium col-span-2 sm:col-span-1"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          <span className="text-xs">Tester</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agreement Inventory Tab */}
          <TabsContent value="agreement-inventory" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Button className="gap-2 shadow-md hover:shadow-lg transition-all">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Variable Inventory</span>
              </Button>
            </div>

            <Card className="border border-border bg-card shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle className="text-lg font-bold">Agreement Inventory List</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3">
                {mockInventory.filter(item => item.type === "Variable").map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-base text-foreground mb-1">{item.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 text-xs">
                          ID: {item.id}
                        </Badge>
                        <Badge variant="outline" className="bg-accent/5 text-accent border-accent/30 text-xs">
                          ${item.price}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Button 
                onClick={() => setDiscountModalOpen(true)} 
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Discount</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {mockDiscounts.map((discount) => (
                <Card 
                  key={discount.id} 
                  className="border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <h3 className="font-bold text-lg text-foreground">{discount.name}</h3>
                          {discount.isDefault && (
                            <Badge variant="outline" className="w-fit bg-primary/15 text-primary border-primary/40 font-semibold px-3 py-1 shadow-sm">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                          <div className="px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                            <span className="text-xs text-muted-foreground block">Value</span>
                            <span className="font-bold text-xl text-accent">{discount.value}{discount.type}</span>
                          </div>
                          <div className="px-4 py-2 bg-muted rounded-lg border border-border">
                            <span className="text-xs text-muted-foreground block">Type</span>
                            <span className="font-semibold text-sm text-foreground">
                              {discount.type === "%" ? "Percentage" : "Fixed Amount"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full lg:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 lg:flex-initial hover:bg-primary/10 hover:text-primary hover:border-primary transition-all font-medium"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="text-sm">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 lg:flex-initial text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Button 
                onClick={() => setEquipmentModalOpen(true)} 
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Equipment</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {mockEquipment.map((equipment) => (
                <Card 
                  key={equipment.id} 
                  className="border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-bold text-base sm:text-lg text-foreground">{equipment.name}</h3>
                            <Badge 
                              className={
                                equipment.status === "Assigned" 
                                  ? "w-fit bg-success/15 text-success border border-success/40 font-semibold px-3 py-1 shadow-sm" 
                                  : "w-fit bg-muted text-muted-foreground border border-border font-semibold px-3 py-1"
                              }
                            >
                              {equipment.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <div className="px-3 py-1.5 bg-muted rounded-md">
                              <span className="text-xs font-medium text-muted-foreground">Serial: </span>
                              <span className="text-xs font-bold text-foreground">{equipment.serialNumber}</span>
                            </div>
                            <div className="px-3 py-1.5 bg-muted rounded-md">
                              <span className="text-xs font-medium text-muted-foreground">SKU: </span>
                              <span className="text-xs font-bold text-foreground">{equipment.sku}</span>
                            </div>
                          </div>
                          
                          {equipment.assignedTo && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                              <UserCheck className="h-4 w-4 text-accent" />
                              <div>
                                <span className="text-xs text-muted-foreground block">Assigned To</span>
                                <span className="font-semibold text-sm text-foreground">{equipment.assignedTo}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all font-medium"
                          onClick={() => setEquipmentAssignModal({ open: true, equipment })}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span className="text-xs">{equipment.status === "Assigned" ? "Reassign" : "Assign"}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-accent/10 hover:text-accent hover:border-accent transition-all font-medium"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="text-xs">Update</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 hover:bg-info/10 hover:text-info hover:border-info transition-all font-medium col-span-2 sm:col-span-1"
                          onClick={() => setEquipmentNotesModal({ open: true, equipment })}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="text-xs">Notes ({equipment.notes.length})</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <InventoryFormModal open={inventoryModalOpen} onOpenChange={setInventoryModalOpen} mode="create" />
        <StockAdjustmentModal 
          open={stockAdjustmentModal.open} 
          onOpenChange={(open) => setStockAdjustmentModal({ open, item: null })}
          item={stockAdjustmentModal.item}
        />
        <LowStockAlertModal
          open={lowStockAlertModal.open}
          onOpenChange={(open) => setLowStockAlertModal({ open, item: null })}
          item={lowStockAlertModal.item}
        />
        <DiscountFormModal open={discountModalOpen} onOpenChange={setDiscountModalOpen} mode="create" />
        <EquipmentFormModal open={equipmentModalOpen} onOpenChange={setEquipmentModalOpen} mode="create" />
        <EquipmentAssignModal
          open={equipmentAssignModal.open}
          onOpenChange={(open) => setEquipmentAssignModal({ open, equipment: null })}
          equipment={equipmentAssignModal.equipment}
        />
        <EquipmentNotesModal
          open={equipmentNotesModal.open}
          onOpenChange={(open) => setEquipmentNotesModal({ open, equipment: null })}
          equipment={equipmentNotesModal.equipment}
        />
      </main>
    </div>
  );
};

export default Inventory;
