import { useNavigate, useLocation } from "react-router-dom";
import { Users, BarChart3, Settings, UserCheck, Clock, MapPinned, Package, ArrowUpCircle, RotateCcw, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OthersMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainMenuItems = [
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

const employeeItems = [
  { label: "Employee List", path: "/employees", icon: UserCheck },
  { label: "Schedule", path: "/employees/schedule", icon: Clock },
  { label: "Job Route", path: "/employees/job-route", icon: MapPinned },
];

const inventoryItems = [
  { label: "Inventory List", path: "/inventory", icon: Package },
  { label: "Stock In/Out", path: "/inventory/stock-in-out", icon: ArrowUpCircle },
  { label: "Refunds", path: "/inventory/refunds", icon: RotateCcw },
];

export const OthersMenu = ({ isOpen, onClose }: OthersMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const handleOptionClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const isEmployeesActive = employeeItems.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + "/")
  );
  const isInventoryActive = inventoryItems.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + "/")
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl safe-bottom max-h-[80vh] overflow-y-auto lg:bottom-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold text-gray-900">Others</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 touch-target"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Main Menu Items */}
          <div className="p-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleOptionClick(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl transition-all touch-target",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "font-medium",
                    isActive && "font-bold"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Employees Collapsible Section */}
            <div className="mt-2">
              <button
                onClick={() => setEmployeesOpen(!employeesOpen)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl transition-all touch-target",
                  isEmployeesActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isEmployeesActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "font-medium",
                    isEmployeesActive && "font-bold"
                  )}>
                    Employees
                  </span>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5 transition-transform",
                  employeesOpen && "transform rotate-90"
                )} />
              </button>
              
              {employeesOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {employeeItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all touch-target",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-gray-600")} />
                        <span className={cn(
                          "text-sm font-medium",
                          isActive && "font-bold"
                        )}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inventory Collapsible Section */}
            <div className="mt-2">
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl transition-all touch-target",
                  isInventoryActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isInventoryActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    <Package className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "font-medium",
                    isInventoryActive && "font-bold"
                  )}>
                    Inventory
                  </span>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5 transition-transform",
                  inventoryOpen && "transform rotate-90"
                )} />
              </button>
              
              {inventoryOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {inventoryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleOptionClick(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all touch-target",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-gray-600")} />
                        <span className={cn(
                          "text-sm font-medium",
                          isActive && "font-bold"
                        )}>
                          {item.label}
                        </span>
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


