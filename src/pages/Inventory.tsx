import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Eye, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const mockInventory = [
  {
    id: "INV-001",
    name: "HVAC Filter - 20x25x1",
    category: "HVAC",
    quantity: 45,
    unit: "pcs",
    cost: 8.50,
    price: 15.00,
    reorderLevel: 20,
    status: "in-stock" as const,
  },
  {
    id: "INV-002",
    name: "Copper Pipe 3/4 inch",
    category: "Plumbing",
    quantity: 12,
    unit: "ft",
    cost: 3.25,
    price: 6.00,
    reorderLevel: 15,
    status: "low-stock" as const,
  },
  {
    id: "INV-003",
    name: "Ceiling Fan - Modern Style",
    category: "Electrical",
    quantity: 8,
    unit: "pcs",
    cost: 85.00,
    price: 180.00,
    reorderLevel: 5,
    status: "in-stock" as const,
  },
  {
    id: "INV-004",
    name: "PVC Pipe 2 inch",
    category: "Plumbing",
    quantity: 3,
    unit: "ft",
    cost: 2.50,
    price: 5.00,
    reorderLevel: 10,
    status: "critical" as const,
  },
  {
    id: "INV-005",
    name: "LED Light Bulbs - 60W Equiv",
    category: "Electrical",
    quantity: 120,
    unit: "pcs",
    cost: 2.00,
    price: 4.50,
    reorderLevel: 50,
    status: "in-stock" as const,
  },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = mockInventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const lowStockItems = mockInventory.filter(item => item.status === "low-stock" || item.status === "critical").length;
  const categories = [...new Set(mockInventory.map(item => item.category))].length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-success/10 text-success border border-success/20";
      case "low-stock":
        return "bg-warning/10 text-warning border border-warning/20";
      case "critical":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border border-muted/20";
    }
  };

  return (
    <div className="flex-1">
      <AppHeader 
        searchPlaceholder="Search inventory items..." 
        onSearchChange={setSearchQuery}
      />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your inventory items
            </p>
          </div>
          <Button className="gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            Add Item
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon={Package}
            trend={{ value: "+8%", positive: true }}
            color="primary"
          />
          <StatCard
            title="Inventory Value"
            value={`$${totalValue.toFixed(2)}`}
            icon={TrendingUp}
            trend={{ value: "+12%", positive: true }}
            color="success"
          />
          <StatCard
            title="Low Stock Alert"
            value={lowStockItems}
            icon={AlertTriangle}
            color="warning"
          />
          <StatCard
            title="Categories"
            value={categories}
            icon={Package}
            color="accent"
          />
        </div>

        {/* Inventory Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Package className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <Badge variant="outline" className="text-xs">{item.id}</Badge>
                        <Badge className="text-xs bg-accent/10 text-accent border border-accent/20">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Quantity: {item.quantity} {item.unit}</span>
                        <span>•</span>
                        <span>Cost: ${item.cost}</span>
                        <span>•</span>
                        <span>Price: ${item.price}</span>
                        <span>•</span>
                        <span>Reorder at: {item.reorderLevel} {item.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="text-lg font-bold text-primary">
                        ${(item.quantity * item.cost).toFixed(2)}
                      </p>
                      <Badge className={getStatusBadge(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Inventory;
