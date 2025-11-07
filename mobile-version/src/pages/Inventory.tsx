import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockInventory } from "@/data/mobileMockData";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const Inventory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const categories = Array.from(new Set(mockInventory.map(i => i.category)));
  
  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = filteredInventory.filter(i => i.stock <= i.lowStockThreshold);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Inventory"
        actions={
          <Button size="sm" onClick={() => navigate("/inventory/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div className="flex-1">
              <p className="font-semibold text-warning">{lowStockItems.length} items low in stock</p>
              <p className="text-sm text-muted-foreground">Review and reorder soon</p>
            </div>
          </div>
        )}
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", ...categories].map(cat => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        
        {/* Summary */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Items</span>
            </div>
            <span className="text-2xl font-bold text-primary">{filteredInventory.length}</span>
          </div>
        </div>
        
        {/* Inventory Cards */}
        <div className="space-y-3">
          {filteredInventory.map(item => {
            const isLowStock = item.stock <= item.lowStockThreshold;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border bg-card active:scale-98 transition-transform cursor-pointer"
                onClick={() => navigate(`/inventory/${item.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-lg font-bold",
                        isLowStock ? "text-destructive" : "text-success"
                      )}>
                        {item.stock}
                      </span>
                      <span className="text-sm text-muted-foreground">in stock</span>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Threshold: {item.lowStockThreshold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${item.unitPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">per unit</p>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                  <p>Supplier: {item.supplier}</p>
                  <p>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
