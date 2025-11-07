import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, DollarSign, Users, UserCheck, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import SalesSubmenu from "./SalesSubmenu";

const navItems = [
  { title: "Home", path: "/", icon: Home, hasSubmenu: false },
  { title: "Sales", path: "/sales", icon: DollarSign, hasSubmenu: true },
  { title: "Customers", path: "/customers", icon: Users, hasSubmenu: false },
  { title: "Employees", path: "/employees", icon: UserCheck, hasSubmenu: false },
  { title: "Others", path: "/settings", icon: MoreHorizontal, hasSubmenu: false },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [salesSubmenuOpen, setSalesSubmenuOpen] = useState(false);

  const isActive = (path: string, hasSubmenu: boolean) => {
    if (path === "/") return location.pathname === "/";
    if (hasSubmenu) {
      // Check if current path is one of the sales submenu paths
      return location.pathname.startsWith("/invoices") || 
             location.pathname.startsWith("/estimates") || 
             location.pathname.startsWith("/agreements");
    }
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.hasSubmenu) {
      e.preventDefault();
      setSalesSubmenuOpen(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 safe-bottom shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.hasSubmenu);
            
            return (
              <button
                key={item.path}
                onClick={(e) => handleItemClick(item, e)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full touch-target transition-all duration-200 relative",
                  active 
                    ? "text-primary" 
                    : "text-gray-500"
                )}
              >
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  active ? "bg-primary/10 scale-110" : "hover:bg-gray-50"
                )}>
                  <Icon className={cn("h-6 w-6", active && "scale-110")} />
                </div>
                <span className={cn(
                  "text-xs mt-0.5 transition-all",
                  active ? "font-bold text-primary" : "font-medium text-gray-500"
                )}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <SalesSubmenu isOpen={salesSubmenuOpen} onClose={() => setSalesSubmenuOpen(false)} />
    </>
  );
};

export default BottomNav;


