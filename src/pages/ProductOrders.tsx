import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileTabletHeader } from "@/components/MobileTabletHeader";
import { AppHeader } from "@/components/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock product order data
const mockProductOrders = [
  {
    id: "ORD-1764081518607-33hb6480g",
    status: "Paid",
    items: [
      { name: "Premium LED Bulb 60W - Energy Efficient Light Bulb", price: 80.00 },
      { name: "Smart Thermostat - WiFi Enabled Programmable", price: 129.99 },
      { name: "Water Filter Replacement Cartridge - 3 Pack", price: 45.99 },
    ],
    customerName: "Sarah Johnson",
    createdBy: "System",
    orderDate: "2024-01-15",
    orderTotal: 51.24,
  },
  {
    id: "ORD-1764081518608-44hb6481h",
    status: "Pending",
    items: [
      { name: "Wireless Doorbell Camera - 1080p HD", price: 199.99 },
      { name: "Ceiling Fan Remote Control - Universal", price: 24.99 },
    ],
    customerName: "Mike Williams",
    createdBy: "John Doe",
    orderDate: "2024-01-14",
    orderTotal: 224.98,
  },
  {
    id: "ORD-1764081518609-55hb6482i",
    status: "Paid",
    items: [
      { name: "Electrical Outlet GFCI - Tamper Resistant", price: 18.99 },
    ],
    customerName: "Emma Davis",
    createdBy: "System",
    orderDate: "2024-01-13",
    orderTotal: 18.99,
  },
  {
    id: "ORD-1764081518610-66hb6483j",
    status: "Paid",
    items: [
      { name: "Pipe Wrench Set - 3 Piece Professional", price: 65.00 },
      { name: "LED Strip Lights - 16ft RGB Color Changing", price: 35.99 },
      { name: "Circuit Breaker - 20A", price: 15.99 },
      { name: "HVAC Filter - Standard", price: 25.99 },
    ],
    customerName: "Robert Brown",
    createdBy: "Jane Smith",
    orderDate: "2024-01-12",
    orderTotal: 142.97,
  },
];

// Status badge colors
const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const ProductOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  const filteredOrders = mockProductOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex-1">
      {isMobileOrTablet ? (
        <MobileTabletHeader title="Product Orders" showBack={true} />
      ) : (
        <AppHeader title="Product Orders" />
      )}

      <main
        className={cn(
          "space-y-4 animate-fade-in overflow-y-auto",
          isMobileOrTablet ? "pt-20 pb-24 px-4" : "px-4 sm:px-6 py-4 sm:py-6"
        )}
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Search orders…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-11 h-10 sm:h-11"
          />
        </div>

        {/* Order Cards */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const displayedItems = order.items.slice(0, 2);
            const remainingCount = order.items.length - 2;

            return (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
              >
                {/* Order ID and Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-base text-gray-900 flex-1">
                    {order.id}
                  </h3>
                  <Badge
                    className={cn(
                      "text-xs whitespace-nowrap px-2 py-1 rounded-full",
                      statusColors[order.status] || "bg-muted text-muted-foreground"
                    )}
                  >
                    {order.status}
                  </Badge>
                </div>

                {/* Purchased Items */}
                <div className="space-y-1.5 mb-3">
                  {displayedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 flex-1">{item.name}</span>
                      <span className="text-gray-900 font-medium ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="text-sm">
                      <span className="text-primary font-medium">
                        +{remainingCount} more items
                      </span>
                    </div>
                  )}
                </div>

                {/* Customer Info Row */}
                <div className="flex items-center justify-between mb-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCircle className="h-4 w-4" />
                    <span>{order.createdBy}</span>
                  </div>
                </div>

                {/* Date Row */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(order.orderDate)}</span>
                </div>

                {/* Order Total */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <div className="text-lg font-bold text-gray-900">
                    ${order.orderTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No orders found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductOrders;
