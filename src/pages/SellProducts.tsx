import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileTabletHeader } from "@/components/MobileTabletHeader";
import { AppHeader } from "@/components/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryFormModal } from "@/components/modals/InventoryFormModal";

// Mock product data with variants
const mockProducts = [
  {
    id: "PROD-001",
    name: "Premium LED Bulb 60W - Energy Efficient Light Bulb",
    sku: "PB-24110005",
    variants: [
      { id: "VAR-001", name: "Black", stock: 4, price: 80.00 },
      { id: "VAR-002", name: "White", stock: 1, price: 80.00 },
    ],
    image: "https://images.unsplash.com/photo-1581993192008-63fd3a3fc32e?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-002",
    name: "Smart Thermostat - WiFi Enabled Programmable",
    sku: "ST-20240001",
    variants: [
      { id: "VAR-003", name: "Silver", stock: 8, price: 129.99 },
      { id: "VAR-004", name: "Black", stock: 5, price: 129.99 },
    ],
    image: "https://images.unsplash.com/photo-1635925854688-e2c227ecad7e?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-003",
    name: "Water Filter Replacement Cartridge - 3 Pack",
    sku: "WF-RC-3PK",
    variants: [
      { id: "VAR-005", name: "Standard", stock: 12, price: 45.99 },
    ],
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-004",
    name: "Wireless Doorbell Camera - 1080p HD",
    sku: "WDBC-1080P",
    variants: [
      { id: "VAR-006", name: "Black", stock: 6, price: 199.99 },
      { id: "VAR-007", name: "White", stock: 3, price: 199.99 },
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-005",
    name: "Ceiling Fan Remote Control - Universal",
    sku: "CF-RC-UNIV",
    variants: [
      { id: "VAR-008", name: "Standard", stock: 15, price: 24.99 },
    ],
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-006",
    name: "Electrical Outlet GFCI - Tamper Resistant",
    sku: "EO-GFCI-TR",
    variants: [
      { id: "VAR-009", name: "White", stock: 20, price: 18.99 },
      { id: "VAR-010", name: "Ivory", stock: 18, price: 18.99 },
    ],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-007",
    name: "Pipe Wrench Set - 3 Piece Professional",
    sku: "PW-SET-3PC",
    variants: [
      { id: "VAR-011", name: "Standard", stock: 9, price: 65.00 },
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop",
  },
  {
    id: "PROD-008",
    name: "LED Strip Lights - 16ft RGB Color Changing",
    sku: "LED-STRIP-16FT",
    variants: [
      { id: "VAR-012", name: "RGB", stock: 7, price: 35.99 },
      { id: "VAR-013", name: "Warm White", stock: 4, price: 32.99 },
    ],
    image: "https://images.unsplash.com/photo-1635925854688-e2c227ecad7e?w=400&h=400&fit=crop",
  },
];

const SellProducts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartItems, setCartItems] = useState<Array<{ fullId: string; product: any; quantity: number }>>([]);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  // Flatten products with variants for search
  const allProducts = mockProducts.flatMap((product) =>
    product.variants.map((variant) => ({
      ...product,
      variant,
      fullId: `${product.id}-${variant.id}`,
    }))
  );

  const filteredProducts = allProducts.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.variant.name.toLowerCase().includes(searchLower)
    );
  });

  const handleQuantityChange = (fullId: string, delta: number, maxStock?: number) => {
    setQuantities((prev) => {
      const current = prev[fullId] || 1; // Default to 1 instead of 0
      let newValue = current + delta;
      // Enforce minimum of 1
      newValue = Math.max(1, newValue);
      // Enforce maximum of stock if provided
      if (maxStock !== undefined) {
        newValue = Math.min(maxStock, newValue);
      }
      return { ...prev, [fullId]: newValue };
    });
  };

  const handleAdd = (fullId: string, product: typeof allProducts[0]) => {
    const quantity = getQuantity(fullId);
    // Add to cart
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.fullId === fullId);
      if (existingItem) {
        // Update quantity if item already exists
        return prev.map((item) =>
          item.fullId === fullId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prev, { fullId, product, quantity }];
      }
    });
  };

  // Calculate total cart items count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle cart button click - navigate to product orders
  const handleCartClick = () => {
    navigate("/sales/product-orders");
  };

  const getQuantity = (fullId: string) => quantities[fullId] || 1; // Default to 1 instead of 0

  // For mobile/tablet, use MobileTabletHeader; for desktop, use AppHeader
  const HeaderComponent = isMobileOrTablet ? MobileTabletHeader : AppHeader;

  return (
    <div className="flex-1">
      {isMobileOrTablet ? (
        <MobileTabletHeader title="Sell Product" />
      ) : (
        <AppHeader title="Sell Product" />
      )}

      <main
        className={cn(
          "space-y-4 animate-fade-in overflow-y-auto",
          isMobileOrTablet
            ? "pt-20 pb-24 px-4"
            : "px-4 sm:px-6 py-4 sm:py-6"
        )}
      >
        {/* Search Bar with Add Inventory Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-11 h-10 sm:h-11"
            />
          </div>
          <Button
            onClick={() => setShowAddInventoryModal(true)}
            className="gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Inventory</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Product Grid - 2 columns on mobile, 3 columns on tablet, 4+ on desktop */}
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-2", // Mobile: 2 columns
            "md:grid-cols-3", // Tablet: 3 columns
            "lg:grid-cols-4" // Desktop: 4 columns
          )}
        >
          {filteredProducts.map((item) => {
            const quantity = getQuantity(item.fullId);

            return (
              <div
                key={item.fullId}
                className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-full aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  {/* Product Name - Max 2 lines */}
                  <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                    {item.name}
                  </h3>

                  {/* SKU and Variant Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono bg-primary/5 text-primary border-primary/30"
                    >
                      SKU: {item.sku}
                    </Badge>
                    {item.variant.name !== "Standard" && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-muted text-foreground"
                      >
                        Variant: {item.variant.name}
                      </Badge>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="text-xs text-muted-foreground">
                    Stock: {item.variant.stock}
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-primary">
                    ${item.variant.price.toFixed(2)}
                  </div>

                  {/* Quantity Selector and Add Button - Horizontal Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Quantity Selector - Left Side */}
                    <div className="flex items-center border rounded-lg bg-white">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-lg"
                        onClick={() => handleQuantityChange(item.fullId, -1, item.variant.stock)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold text-sm">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-lg"
                        onClick={() => handleQuantityChange(item.fullId, 1, item.variant.stock)}
                        disabled={quantity >= item.variant.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Add Button - Right Side */}
                    <Button
                      onClick={() => handleAdd(item.fullId, item)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found matching your search.
            </p>
          </div>
        )}
      </main>

      {/* Add Inventory Modal */}
      <InventoryFormModal
        open={showAddInventoryModal}
        onOpenChange={setShowAddInventoryModal}
        mode="create"
      />

      {/* Floating Cart Button - Tablet View Only */}
      {cartItemCount > 0 && (
        <button
          onClick={handleCartClick}
          className="fixed bottom-24 right-6 z-40 hidden md:flex lg:hidden h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 items-center justify-center animate-in fade-in slide-in-from-bottom-4 touch-target"
          style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom) + 0.5rem)' }}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center border-2 border-white min-w-[1.25rem]">
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </span>
        </button>
      )}
    </div>
  );
};

export default SellProducts;
