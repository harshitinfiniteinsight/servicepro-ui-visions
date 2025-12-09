import { useNavigate, useLocation } from "react-router-dom";
import { FileText, FileCheck, ClipboardList, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const salesOptions = [
  { label: "Invoices", path: "/invoices", icon: FileText },
  { label: "Estimates", path: "/estimates", icon: FileCheck },
  { label: "Agreements", path: "/agreements", icon: ClipboardList },
  { label: "Sell Products", path: "/sales/sell-products", icon: ShoppingCart },
];

export const SalesSubmenu = ({ isOpen, onClose }: SalesSubmenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOptionClick = (path: string) => {
    navigate(path);
    onClose();
  };

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sales Panel - Right side panel matching MainMenu style */}
      <div className="fixed top-0 right-0 bottom-0 z-50 bg-white shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900">Sales</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 touch-target transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {salesOptions.map((option) => {
              const Icon = option.icon;
              const active = isActive(option.path);

              return (
                <button
                  key={option.path}
                  onClick={() => handleOptionClick(option.path)}
                  className={cn(
                    "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                    active
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-gray-50 text-gray-700 font-medium"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors flex-shrink-0",
                      active ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-base text-left">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

