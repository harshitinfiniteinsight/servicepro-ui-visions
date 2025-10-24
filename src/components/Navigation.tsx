import { Home, Users, Briefcase, FileText, FileCheck, ClipboardList, UserCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: FileText, label: "Invoices", path: "/invoices" },
  { icon: FileCheck, label: "Estimates", path: "/estimates" },
  { icon: ClipboardList, label: "Agreements", path: "/agreements" },
  { icon: UserCheck, label: "Employees", path: "/employees" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-t border-border md:border-r md:border-t-0 fixed bottom-0 left-0 right-0 md:relative md:h-screen md:w-20 lg:w-64 z-40">
      <div className="flex md:flex-col h-16 md:h-full overflow-x-auto md:overflow-x-visible md:py-6 md:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-3 md:px-6 py-2 md:py-3 md:mx-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 md:h-6 md:w-6", isActive && "animate-scale-in")} />
              <span className="text-xs md:text-sm font-medium lg:block hidden">{item.label}</span>
              <span className="text-[10px] md:hidden">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
