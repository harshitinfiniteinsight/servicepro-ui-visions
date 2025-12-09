import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Briefcase, DollarSign, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { SalesSubmenu } from "./SalesSubmenu";
import { OthersMenu } from "./OthersMenu";
import { MainMenu } from "./MainMenu";
import { useIsTablet } from "@/hooks/use-tablet";

const navItems = [
  { title: "Dashboard", path: "/", icon: Home, hasSubmenu: false },
  { title: "Job Dashboard", path: "/jobs", icon: Briefcase, hasSubmenu: false },
  { title: "Sales", path: "/invoices", icon: DollarSign, hasSubmenu: true },
  { title: "Appointments", path: "/appointments/manage", icon: Calendar, hasSubmenu: false },
  { title: "Others", path: "/settings", icon: MoreHorizontal, hasSubmenu: false },
];

type ActiveTab = "dashboard" | "jobs" | "sales" | "appointments" | "others" | null;

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTablet = useIsTablet();
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [salesSubmenuOpen, setSalesSubmenuOpen] = useState(false);
  const [othersMenuOpen, setOthersMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const prevPathnameRef = useRef(location.pathname);
  const prevOthersPathnameRef = useRef(location.pathname);

  // Helper to determine if a route is a Sales route
  const isSalesRoute = (pathname: string) => {
    return pathname.startsWith("/invoices") || 
           pathname.startsWith("/estimates") || 
           pathname.startsWith("/agreements") ||
           pathname.startsWith("/sales/sell-products");
  };

  // Helper to determine if a route is an Others route
  const isOthersRoute = (pathname: string) => {
    return pathname.startsWith("/settings") || 
           pathname.startsWith("/reports") ||
           pathname.startsWith("/customers") ||
           pathname.startsWith("/employees") ||
           pathname.startsWith("/inventory");
  };

  // Determine active tab based on route (used for initial state and route changes)
  const getActiveTabFromRoute = (pathname: string): ActiveTab => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/jobs")) return "jobs";
    if (isSalesRoute(pathname)) return "sales";
    if (pathname.startsWith("/appointments") || pathname.startsWith("/add-appointment")) return "appointments";
    if (isOthersRoute(pathname)) return "others";
    return null;
  };

  // Update activeTab when route changes (for actual navigation)
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      const routeBasedTab = getActiveTabFromRoute(location.pathname);
      // Update activeTab based on the new route
      // This ensures the correct tab is highlighted after navigation
      setActiveTab(routeBasedTab);
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Initialize activeTab from current route on mount
  useEffect(() => {
    if (activeTab === null) {
      setActiveTab(getActiveTabFromRoute(location.pathname));
    }
  }, [location.pathname, activeTab]);

  // Determine if a tab should be highlighted
  const isActive = (item: typeof navItems[0]) => {
    // If activeTab is set, use it (prioritize user selection)
    if (activeTab !== null) {
      if (item.title === "Dashboard") return activeTab === "dashboard";
      if (item.title === "Job Dashboard") return activeTab === "jobs";
      if (item.title === "Sales") return activeTab === "sales";
      if (item.title === "Appointments") return activeTab === "appointments";
      if (item.title === "Others") return activeTab === "others";
    }
    // Fallback to route-based detection
    return getActiveTabFromRoute(location.pathname) === 
           (item.title === "Dashboard" ? "dashboard" :
            item.title === "Job Dashboard" ? "jobs" :
            item.title === "Sales" ? "sales" :
            item.title === "Appointments" ? "appointments" :
            item.title === "Others" ? "others" : null);
  };

  // Auto-close Sales submenu when activeTab changes away from sales
  useEffect(() => {
    if (activeTab !== "sales" && salesSubmenuOpen) {
      setSalesSubmenuOpen(false);
    }
  }, [activeTab, salesSubmenuOpen]);

  // Auto-close Others menu when activeTab changes away from others
  useEffect(() => {
    if (activeTab !== "others" && othersMenuOpen) {
      setOthersMenuOpen(false);
    }
  }, [activeTab, othersMenuOpen]);

  // Auto-close Main Menu when activeTab changes away from others
  useEffect(() => {
    if (activeTab !== "others" && mainMenuOpen) {
      setMainMenuOpen(false);
    }
  }, [activeTab, mainMenuOpen]);

  // Auto-close Sales submenu when navigating away from Sales routes
  // Only close when the route actually changes (not when submenu opens)
  useEffect(() => {
    // Only act if the pathname actually changed
    if (prevPathnameRef.current !== location.pathname) {
      // Close submenu if user navigated to a non-Sales route
      if (salesSubmenuOpen && !isSalesRoute(location.pathname)) {
        setSalesSubmenuOpen(false);
      }
      
      // Update the previous pathname
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, salesSubmenuOpen]);

  // Auto-close Others menu when navigating away from Others routes
  // Only close when the route actually changes (not when menu opens)
  useEffect(() => {
    // Only act if the pathname actually changed
    if (prevOthersPathnameRef.current !== location.pathname) {
      // Close menu if user navigated to a non-Others route
      if (othersMenuOpen && !isOthersRoute(location.pathname)) {
        setOthersMenuOpen(false);
      }
      
      // Update the previous pathname
      prevOthersPathnameRef.current = location.pathname;
    }
  }, [location.pathname, othersMenuOpen]);

  const handleItemClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    // Determine the tab name for this item
    const tabName: ActiveTab = 
      item.title === "Dashboard" ? "dashboard" :
      item.title === "Job Dashboard" ? "jobs" :
      item.title === "Sales" ? "sales" :
      item.title === "Appointments" ? "appointments" :
      item.title === "Others" ? "others" : null;

    // Always update activeTab immediately when a tab is clicked
    if (tabName) {
      setActiveTab(tabName);
    }

    if (item.hasSubmenu) {
      // Sales tab: Toggle the Sales submenu (open if closed, close if open)
      e.preventDefault();
      setSalesSubmenuOpen((prev) => !prev);
      // Close Others menu if open (only one menu open at a time)
      if (othersMenuOpen) {
        setOthersMenuOpen(false);
      }
    } else if (item.title === "Others") {
      // Others tab: Toggle the appropriate menu (MainMenu for tablet/desktop, OthersMenu for mobile)
      e.preventDefault();
      // Check viewport width to determine which menu to show
      const isTabletOrDesktop = window.innerWidth >= 768;
      if (isTabletOrDesktop) {
        setMainMenuOpen((prev) => !prev);
        setOthersMenuOpen(false); // Ensure mobile menu is closed
      } else {
        setOthersMenuOpen((prev) => !prev);
        setMainMenuOpen(false); // Ensure tablet menu is closed
      }
      // Close Sales submenu if open (only one menu open at a time)
      if (salesSubmenuOpen) {
        setSalesSubmenuOpen(false);
      }
    } else {
      // Dashboard, Job Dashboard, or Appointments: Navigate and close all menus
      // This ensures menus close immediately when user taps any other bottom nav item
      if (salesSubmenuOpen) {
        setSalesSubmenuOpen(false);
      }
      if (othersMenuOpen) {
        setOthersMenuOpen(false);
      }
      if (mainMenuOpen) {
        setMainMenuOpen(false);
      }
      navigate(item.path);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 safe-bottom shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-6xl mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.path}
                onClick={(e) => handleItemClick(item, e)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full touch-target transition-all duration-200 relative min-w-0 px-1",
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
                  "text-xs mt-0.5 transition-all text-center truncate w-full",
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
      {/* Show MainMenu for tablet/desktop (768px+), OthersMenu for mobile only */}
      <MainMenu isOpen={mainMenuOpen} onClose={() => setMainMenuOpen(false)} />
      <OthersMenu isOpen={othersMenuOpen} onClose={() => setOthersMenuOpen(false)} />
    </>
  );
};

