import { Settings, User, KeyRound, Shield, FileText, CreditCard, Languages, HelpCircle, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  title?: string;
  searchPlaceholder?: string; // Deprecated - kept for backwards compatibility
  onSearchChange?: (value: string) => void; // Deprecated - kept for backwards compatibility
}

const getUserName = (): string => {
  // Try to get user name from localStorage
  const userName = localStorage.getItem("userName");
  const firstName = localStorage.getItem("firstName");
  const fullName = localStorage.getItem("fullName");
  
  let name = "";
  if (userName) {
    name = userName;
  } else if (firstName) {
    name = firstName;
  } else if (fullName) {
    // Extract first name from full name
    name = fullName.split(" ")[0];
  } else {
    // Default fallback
    name = "User";
  }
  
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const settingsMenuItems = [
  { label: "Profile", path: "/settings/profile", icon: User },
  { label: "Change Password", path: "/settings/change-password", icon: KeyRound },
  { label: "Permission Settings", path: "/settings/permissions", icon: Shield },
  { label: "Business Policies", path: "/settings/business-policies", icon: FileText },
  { label: "Payment Settings", path: "/settings/payment-methods", icon: CreditCard },
  { label: "Change App Language", path: "/settings/language", icon: Languages },
  { label: "Help", path: "/settings/help", icon: HelpCircle },
];

export const AppHeader = ({ title = "Dashboard" }: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("User");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsSettingsOpen(false);
  }, [location.pathname]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        settingsDropdownRef.current &&
        settingsButtonRef.current &&
        !settingsDropdownRef.current.contains(event.target as Node) &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleSettingsClick = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setIsSettingsOpen(false);
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      navigate("/signin");
    }, 1000);
  };

  const handleNotifications = () => {
    // Placeholder handler for notifications
    // TODO: Implement notification panel or navigation
    console.log("Notifications clicked");
  };

  return (
    <header className={cn(
      "z-30 bg-white border-b border-gray-200 shadow-sm",
      isMobileOrTablet ? "fixed top-0 left-0 right-0 safe-top" : "sticky top-0"
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Screen Title */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
          {title}
        </h1>

        {/* Right: Hello User + Notification Bell + Settings Icon */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          <span className="text-sm sm:text-base text-gray-700 font-medium">
            Hello {userName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="touch-target hover:bg-gray-100"
            onClick={handleNotifications}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
          </Button>
          <div className="relative">
            <Button
              ref={settingsButtonRef}
              variant="ghost"
              size="icon"
              className={cn(
                "touch-target hover:bg-gray-100",
                isSettingsOpen && "bg-gray-100"
              )}
              onClick={handleSettingsClick}
              aria-label="Settings menu"
              aria-expanded={isSettingsOpen}
            >
              <Settings className="h-5 w-5 text-gray-700" />
          </Button>

            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <div
                ref={settingsDropdownRef}
                className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
              >
                <div className="py-1">
                  {settingsMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleMenuItemClick(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                          isActive && "bg-primary/5 text-primary"
                        )}
                        role="menuitem"
                      >
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive ? "text-primary" : "text-gray-600"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          isActive && "font-semibold"
                        )}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-1" />
                  
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
                    role="menuitem"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
