import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockInventory } from "@/data/mockData";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SelectInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInventory: (item: any, customPrice?: number) => void;
}

export function SelectInventoryModal({
  open,
  onOpenChange,
  onSelectInventory,
}: SelectInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: any) => {
    // For Variable items, still allow custom price entry
    if (item.type === "Variable") {
      // For now, use default price - can be enhanced later with custom price modal
      onSelectInventory(item, item.price);
    } else {
      onSelectInventory(item);
    }
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery("");
  };

  const typeColors = {
    F: "bg-blue-100 text-blue-700 border-blue-200",
    V: "bg-purple-100 text-purple-700 border-purple-200",
    U: "bg-green-100 text-green-700 border-green-200",
  };

  const getTypeLabel = (type: string) => {
    if (type === "Fixed") return "F";
    if (type === "Variable") return "V";
    if (type === "Per Unit") return "U";
    return type;
  };

  const getTypeColor = (type: string) => {
    if (type === "Fixed") return typeColors.F;
    if (type === "Variable") return typeColors.V;
    if (type === "Per Unit") return typeColors.U;
    return typeColors.U;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-full sm:max-w-[600px] md:max-w-[650px] lg:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl md:rounded-xl border shadow-lg">
        {/* Modal Header */}
        <DialogHeader className="bg-[#F46A1F] text-white px-4 md:px-6 lg:px-8 pt-6 pb-4">
          <DialogDescription className="sr-only">
            Select an existing inventory item to add to the invoice
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white flex-1">
              Add Existing Item
            </DialogTitle>
            <button
              onClick={handleClose}
              className="ml-4 h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-full hover:bg-orange-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-5">
          {/* Inventory Type Legend */}
          <div className="bg-gray-100 rounded-full px-4 md:px-5 py-2.5 md:py-3 text-center">
            <p className="text-xs md:text-sm text-gray-700 font-medium">
              Inventory Type: <span className="font-semibold">F</span> = Fixed{" "}
              <span className="font-semibold">V</span> = Variable{" "}
              <span className="font-semibold">U</span> = Per Unit
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search inventory…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 md:h-[52px] rounded-full border-2 border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Inventory List */}
          <div className="space-y-3 md:space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-sm md:text-base">No items found</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  Try adjusting your search
                </p>
              </div>
            ) : (
              filteredInventory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-4 md:p-5 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all h-auto min-h-[72px] md:min-h-[80px]"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Side - Name and SKU */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1.5">
                        <h3 className="font-semibold text-base md:text-lg text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-semibold border px-2 py-0.5 flex-shrink-0",
                            getTypeColor(item.type)
                          )}
                        >
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 truncate">
                        {item.sku}
                      </p>
                    </div>

                    {/* Right Side - Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-base md:text-lg text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.type === "Per Unit" && item.itemUnit && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          per {item.itemUnit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
