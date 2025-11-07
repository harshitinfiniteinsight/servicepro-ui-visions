import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", path: "/", icon: Home },
  { title: "Customers", path: "/customers", icon: Users },
  { title: "Jobs", path: "/jobs", icon: Briefcase },
  { title: "Invoices", path: "/invoices", icon: FileText },
  { title: "More", path: "/settings", icon: MoreHorizontal },
];

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6 mb-1", active && "scale-110")} />
              <span className={cn("text-xs font-medium", active && "font-semibold")}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;


