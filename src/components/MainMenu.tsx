import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Home,
  Briefcase,
  FileText,
  FileCheck,
  ClipboardList,
  ShoppingCart,
  Users,
  Package,
  ArrowUpCircle,
  RotateCcw,
  UserCheck,
  Clock,
  MapPinned,
  BarChart3,
  User,
  KeyRound,
  Shield,
  Languages,
  HelpCircle,
  LogOut,
  CreditCard,
  ScanLine,
  X,
  ChevronDown,
  Calendar,
  Bell,
  DollarSign,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsTablet } from "@/hooks/use-tablet";

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Menu structure
const topLevelItems = [
  { label: "Dashboard", path: "/", icon: Home, hasAccordion: false },
  { label: "Job Dashboard", path: "/jobs", icon: Briefcase, hasAccordion: false },
];

const salesItems = [
  { label: "Invoices", path: "/invoices", icon: FileText },
  { label: "Estimates", path: "/estimates", icon: FileCheck },
  { label: "Agreements", path: "/agreements", icon: ClipboardList },
  { label: "Sell Products", path: "/sales/sell-products", icon: ShoppingCart },
];

const inventoryItems = [
  { label: "Inventory List", path: "/inventory", icon: Package },
  { label: "Inventory Stock In/Out", path: "/inventory/stock-in-out", icon: ArrowUpCircle },
  { label: "Inventory Refund", path: "/inventory/refunds", icon: RotateCcw },
];

const employeeItems = [
  { label: "Employee List", path: "/employees", icon: UserCheck },
  { label: "Schedule", path: "/employees/schedule", icon: Clock },
  { label: "Job Route", path: "/employees/job-route", icon: MapPinned },
];

const reportItems = [
  { label: "Invoice Report", path: "/reports/invoice", icon: FileText },
  { label: "Estimate Report", path: "/reports/estimate", icon: FileCheck },
  { label: "Monthly Report Alert", path: "/reports/monthly-alert", icon: Bell },
];

const settingsItems = [
  { label: "Profile", path: "/settings/profile", icon: User },
  { label: "Change Password", path: "/settings/change-password", icon: KeyRound },
  { label: "Permission Settings", path: "/settings/permissions", icon: Shield },
  { label: "Business Policies", path: "/settings/business-policies", icon: FileText },
  { label: "Feedback Settings", path: "/settings/feedback", icon: Bell },
  { label: "Payment Settings", path: "/settings/payment-methods", icon: CreditCard },
  { label: "Configure Card Reader", path: "/settings/card-reader", icon: ScanLine },
  { label: "Change App Language", path: "/settings/language", icon: Languages },
  { label: "Help", path: "/settings/help", icon: HelpCircle },
];

export const MainMenu = ({ isOpen, onClose }: MainMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isTablet = useIsTablet();

  // Accordion states - only one can be open at a time
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Check if any item in an accordion group is active
  const isGroupActive = (items: typeof salesItems) => {
    return items.some((item) => isActive(item.path));
  };

  // Auto-expand accordion if current route matches items in that accordion
  useEffect(() => {
    if (isOpen) {
      if (isGroupActive(salesItems)) {
        setOpenAccordion("sales");
      } else if (isGroupActive(inventoryItems)) {
        setOpenAccordion("inventory");
      } else if (isGroupActive(employeeItems)) {
        setOpenAccordion("employees");
      } else if (isGroupActive(reportItems)) {
        setOpenAccordion("reports");
      } else if (isGroupActive(settingsItems)) {
        setOpenAccordion("settings");
      }
    }
  }, [isOpen, location.pathname]);

  const handleOptionClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      navigate("/");
      onClose();
    }, 1000);
  };

  const toggleAccordion = (accordionId: string) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  if (!isOpen) return null;

  // Show MainMenu for tablet/desktop (768px and above)
  // Mobile (below 768px) should use the simpler OthersMenu
  if (window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Main Menu Panel - Right side panel for tablet view */}
      <div className="fixed top-0 right-0 bottom-0 z-50 bg-white shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900">Others</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 touch-target transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {/* Top Level Items */}
            {topLevelItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleOptionClick(item.path)}
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
                  <span className="text-base text-left">{item.label}</span>
                </button>
              );
            })}

            {/* Sales Accordion */}
            <div className="mt-2">
              <button
                onClick={() => toggleAccordion("sales")}
                className={cn(
                  "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                  isGroupActive(salesItems)
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isGroupActive(salesItems)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-base text-left flex-1">Sales</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    openAccordion === "sales" && "transform rotate-180"
                  )}
                />
              </button>

              {openAccordion === "sales" && (
                <div className="ml-6 mt-2 space-y-1">
                  {salesItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-all touch-target",
                          active
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "text-gray-600")} />
                        <span className={cn("text-sm text-left", active && "font-bold")}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customers */}
            <button
              onClick={() => handleOptionClick("/customers")}
              className={cn(
                "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                isActive("/customers")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-gray-50 text-gray-700 font-medium"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors flex-shrink-0",
                  isActive("/customers") ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                <Users className="h-5 w-5" />
              </div>
              <span className="text-base text-left">Customers</span>
            </button>

            {/* Inventory Accordion */}
            <div className="mt-2">
              <button
                onClick={() => toggleAccordion("inventory")}
                className={cn(
                  "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                  isGroupActive(inventoryItems)
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isGroupActive(inventoryItems)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-base text-left flex-1">Inventory</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    openAccordion === "inventory" && "transform rotate-180"
                  )}
                />
              </button>

              {openAccordion === "inventory" && (
                <div className="ml-6 mt-2 space-y-1">
                  {inventoryItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-all touch-target",
                          active
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "text-gray-600")} />
                        <span className={cn("text-sm text-left", active && "font-bold")}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Employees Accordion */}
            <div className="mt-2">
              <button
                onClick={() => toggleAccordion("employees")}
                className={cn(
                  "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                  isGroupActive(employeeItems)
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isGroupActive(employeeItems)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <UserCheck className="h-5 w-5" />
                </div>
                <span className="text-base text-left flex-1">Employees</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    openAccordion === "employees" && "transform rotate-180"
                  )}
                />
              </button>

              {openAccordion === "employees" && (
                <div className="ml-6 mt-2 space-y-1">
                  {employeeItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-all touch-target",
                          active
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "text-gray-600")} />
                        <span className={cn("text-sm text-left", active && "font-bold")}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reports Accordion */}
            <div className="mt-2">
              <button
                onClick={() => toggleAccordion("reports")}
                className={cn(
                  "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                  isGroupActive(reportItems)
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isGroupActive(reportItems)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-base text-left flex-1">Reports</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    openAccordion === "reports" && "transform rotate-180"
                  )}
                />
              </button>

              {openAccordion === "reports" && (
                <div className="ml-6 mt-2 space-y-1">
                  {reportItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-all touch-target",
                          active
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "text-gray-600")} />
                        <span className={cn("text-sm text-left", active && "font-bold")}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings Accordion */}
            <div className="mt-2">
              <button
                onClick={() => toggleAccordion("settings")}
                className={cn(
                  "w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all touch-target",
                  isGroupActive(settingsItems)
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isGroupActive(settingsItems)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <Settings className="h-5 w-5" />
                </div>
                <span className="text-base text-left flex-1">Settings</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    openAccordion === "settings" && "transform rotate-180"
                  )}
                />
              </button>

              {openAccordion === "settings" && (
                <div className="ml-6 mt-2 space-y-1">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          if (item.label === "Logout") {
                            handleLogout();
                          } else {
                            handleOptionClick(item.path);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center justify-start gap-3 p-3 rounded-lg transition-all touch-target",
                          active
                            ? "bg-primary/10 text-primary font-bold"
                            : item.label === "Logout"
                            ? "text-destructive hover:bg-destructive/10"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            active ? "text-primary" : item.label === "Logout" ? "text-destructive" : "text-gray-600"
                          )}
                        />
                        <span className={cn("text-sm text-left", active && "font-bold")}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

