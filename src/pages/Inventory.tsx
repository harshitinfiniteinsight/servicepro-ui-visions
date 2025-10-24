import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Wrench, Tags, FileText, AlertTriangle, Edit, Trash2 } from "lucide-react";
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
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="agreement-inventory" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Agreement Inv.</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-2">
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Discounts</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="gap-2 w-full sm:w-auto">
                <FileText className="h-4 w-4" />
                Current Report
              </Button>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                Generate Report
              </Button>
              <Button onClick={() => setInventoryModalOpen(true)} className="gap-2 w-full sm:w-auto ml-auto">
                <Plus className="h-4 w-4" />
                Add Inventory
              </Button>
            </div>

            <div className="grid gap-4">
              {mockInventory.map((item) => (
                <Card key={item.id} className="border-0 shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground">
                              {item.name} <Badge variant="outline" className="ml-2">{getTypeLabel(item.type)}</Badge>
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
                            <span>ID: {item.id}</span>
                            <span>SKU: {item.sku}</span>
                            <span>Category: {item.category}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div>
                              <span className="text-sm text-muted-foreground">Stock: </span>
                              <span className="font-semibold text-foreground">{item.stockQuantity}</span>
                            </div>
                            {item.stockQuantity <= item.lowStockAlert && item.stockQuantity > 0 && (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Low Stock
                              </Badge>
                            )}
                            <div>
                              <span className="text-sm text-muted-foreground">Price: </span>
                              <span className="font-bold text-primary text-lg">${item.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
                          <Edit className="h-4 w-4" />
                          Update
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          <Package className="h-4 w-4" />
                          Add Stock
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setLowStockAlertModal({ open: true, item })}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Alert
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          Damage Goods
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setStockAdjustmentModal({ open: true, item })}
                        >
                          Tester Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agreement Inventory Tab */}
          <TabsContent value="agreement-inventory" className="space-y-4">
            <div className="flex justify-end">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Variable Inventory
              </Button>
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Agreement Inventory List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockInventory.filter(item => item.type === "Variable").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setDiscountModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Discount
              </Button>
            </div>

            <div className="grid gap-4">
              {mockDiscounts.map((discount) => (
                <Card key={discount.id} className="border-0 shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-foreground">{discount.name}</h3>
                          {discount.isDefault && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">Value: <span className="font-semibold text-foreground">{discount.value}{discount.type}</span></span>
                          <span className="text-muted-foreground">Type: <span className="font-semibold text-foreground">{discount.type === "%" ? "Percentage" : "Fixed Amount"}</span></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setEquipmentModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>

            <div className="grid gap-4">
              {mockEquipment.map((equipment) => (
                <Card key={equipment.id} className="border-0 shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground">{equipment.name}</h3>
                            <Badge className={equipment.status === "Assigned" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                              {equipment.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
                            <span>Serial: {equipment.serialNumber}</span>
                            <span>SKU: {equipment.sku}</span>
                            {equipment.assignedTo && <span>Employee: {equipment.assignedTo}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setEquipmentAssignModal({ open: true, equipment })}
                        >
                          {equipment.status === "Assigned" ? "Reassign" : "Assign"}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
                          <Edit className="h-4 w-4" />
                          Update
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-initial"
                          onClick={() => setEquipmentNotesModal({ open: true, equipment })}
                        >
                          View Notes ({equipment.notes.length})
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
